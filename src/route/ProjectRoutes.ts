import { Router } from 'express';
import { nameSchema, projectSchema, teamIDSchema } from '../config/joiSchemas';
import {
    createProject,
    deleteProject,
    getProjects,
    updateProjectName,
} from '../controller/ProjectController';
import {
    authenticateAdmin,
    authenticateMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const ProjectRoutes = Router();
const baseURI = '/team/:teamID/project';

//Get Team Projects
ProjectRoutes.get(
    baseURI,
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateMember,
    getProjects,
);

// Create Project
ProjectRoutes.post(
    baseURI,
    validateRequest(nameSchema),
    authenticateToken,
    authenticateAdmin,
    createProject,
);

//Delete Project
ProjectRoutes.delete(
    baseURI + '/:projectID',
    validateParams(projectSchema),
    authenticateToken,
    authenticateAdmin,
    deleteProject,
);

//Update Project's Name
ProjectRoutes.put(
    baseURI + '/:projectID/name',
    validateParams(projectSchema),
    validateRequest(nameSchema),
    authenticateToken,
    authenticateAdmin,
    updateProjectName,
);

export default ProjectRoutes;
