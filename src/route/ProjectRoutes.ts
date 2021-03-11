import { Router } from 'express';
import {
    nameSchema,
    projectIDSchema,
    teamIDSchema,
} from '../config/joiSchemas';
import {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    updateProjectName,
} from '../controller/ProjectController';
import { getTasks } from '../controller/TaskController';
import {
    authenticateProjectAdmin,
    authenticateProjectMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const ProjectRoutes = Router();

//Get User's Projects
ProjectRoutes.get('', authenticateToken, getProjects);

//TODO: remove teamID from URI
// Create Project
ProjectRoutes.post(
    '/team/:teamID',
    validateParams(teamIDSchema),
    validateRequest(nameSchema),
    authenticateToken,
    createProject,
);

// Get Project
ProjectRoutes.get(
    '/:projectID',
    validateParams(projectIDSchema),
    authenticateToken,
    authenticateProjectMember,
    getProject,
);

//Delete Project
ProjectRoutes.delete(
    '/:projectID',
    validateParams(projectIDSchema),
    authenticateToken,
    authenticateProjectAdmin,
    deleteProject,
);

//Update Project's Name
ProjectRoutes.put(
    '/:projectID/name',
    validateParams(projectIDSchema),
    validateRequest(nameSchema),
    authenticateToken,
    authenticateProjectAdmin,
    updateProjectName,
);

//Get Project Tasks
ProjectRoutes.get(
    '/:projectID/task',
    validateParams(projectIDSchema),
    authenticateToken,
    authenticateProjectMember,
    getTasks,
);

export default ProjectRoutes;
