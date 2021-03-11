import { Router } from 'express';
import {
    nameSchema,
    projectIDSchema,
    projectSchema,
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
    authenticateTeamAdmin,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const ProjectRoutes = Router();

//Get User's Projects
ProjectRoutes.get('', authenticateToken, getProjects);

// Create Project
ProjectRoutes.post(
    '',
    validateRequest(projectSchema),
    authenticateToken,
    authenticateTeamAdmin,
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
