import { Router } from 'express';
import {
    authenticateAdmin,
    authenticateAdminByParams,
    authenticateMemberByParams,
    authenticateToken,
} from '../controllers/AuthenticationController';
import {
    changeProjectName,
    createProject,
    getProjects,
    removeProject,
} from '../controllers/ProjectController';
import { createTask } from '../controllers/TaskController';
import validateRequest, {
    getProjectSchema,
    postProjectSchema,
    projectSchema,
    taskSchema,
    teamIDSchema,
    updateProjectSchema,
    validateParams,
} from '../middleware/validateRequest';

const ProjectRoutes = Router();

ProjectRoutes.get(
    '/:team_id',
    validateParams(getProjectSchema),
    authenticateToken,
    authenticateMemberByParams,
    getProjects,
);

ProjectRoutes.post(
    '',
    validateRequest(postProjectSchema),
    authenticateToken,
    authenticateAdmin,
    createProject,
);

ProjectRoutes.delete(
    '/:team_id/:project_id',
    validateParams(projectSchema),
    authenticateToken,
    authenticateAdminByParams,
    removeProject,
);

ProjectRoutes.put(
    '/:team_id/:project_id/update-name',
    validateRequest(updateProjectSchema),
    validateParams(projectSchema),
    authenticateToken,
    authenticateAdminByParams,
    changeProjectName,
);

ProjectRoutes.post(
    '/:team_id/task',
    validateParams(teamIDSchema),
    validateRequest(taskSchema),
    authenticateToken,
    authenticateAdminByParams,
    createTask,
);

export default ProjectRoutes;
