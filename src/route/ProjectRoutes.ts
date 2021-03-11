import { Router } from 'express';
import { nameSchema, projectSchema, teamIDSchema } from '../config/joiSchemas';
import {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    getTeamProjects,
    updateProjectName,
} from '../controller/ProjectController';
import {
    authenticateTeamAdmin,
    authenticateTeamMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const ProjectRoutes = Router();
const baseURI = '/team/:teamID/project';

//Get User's Projects
ProjectRoutes.get('/project', authenticateToken, getProjects);

//Get Team Projects
ProjectRoutes.get(
    baseURI,
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateTeamMember,
    getTeamProjects,
);

// Create Project
ProjectRoutes.post(
    baseURI,
    validateRequest(nameSchema),
    authenticateToken,
    authenticateTeamAdmin,
    createProject,
);

// Get Project
ProjectRoutes.get(
    baseURI + '/:projectID',
    validateParams(projectSchema),
    authenticateToken,
    authenticateTeamMember,
    getProject,
);

//Delete Project
ProjectRoutes.delete(
    baseURI + '/:projectID',
    validateParams(projectSchema),
    authenticateToken,
    authenticateTeamAdmin,
    deleteProject,
);

//Update Project's Name
ProjectRoutes.put(
    baseURI + '/:projectID/name',
    validateParams(projectSchema),
    validateRequest(nameSchema),
    authenticateToken,
    authenticateTeamAdmin,
    updateProjectName,
);

export default ProjectRoutes;
