import { Router } from 'express';
import {
    authenticateAdmin,
    authenticateMember,
    authenticateToken,
} from '../controllers/AuthenticationController';
import {
    changeProjectName,
    getProjects,
    removeProject,
} from '../controllers/ProjectController';
import validateRequest, {
    deleteProjectSchema,
    getProjectSchema,
    postProjectSchema,
    updateProjectSchema,
} from '../middleware/validateRequest';

const ProjectRoutes = Router();

ProjectRoutes.get(
    '',
    validateRequest(getProjectSchema),
    authenticateToken,
    authenticateMember,
    getProjects,
);

ProjectRoutes.post(
    '',
    validateRequest(postProjectSchema),
    authenticateToken,
    authenticateAdmin,
    getProjects,
);

ProjectRoutes.post(
    '/delete',
    validateRequest(deleteProjectSchema),
    authenticateToken,
    authenticateAdmin,
    removeProject,
);

ProjectRoutes.put(
    '/update-name',
    validateRequest(updateProjectSchema),
    authenticateToken,
    authenticateAdmin,
    changeProjectName,
);

export default ProjectRoutes;
