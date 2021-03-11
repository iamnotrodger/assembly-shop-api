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
    getTeamProjects,
    updateProjectName,
} from '../controller/ProjectController';
import {
    authenticateProjectAdmin,
    authenticateProjectMember,
    authenticateTeamMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const ProjectRoutes = Router();

//Get User's Projects
ProjectRoutes.get('', authenticateToken, getProjects);

//Get Team Projects
ProjectRoutes.get(
    '/team/:teamID',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateTeamMember,
    getTeamProjects,
);

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

export default ProjectRoutes;
