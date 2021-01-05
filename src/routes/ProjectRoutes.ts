import { Router } from 'express';
import { createAssignment } from '../controllers/AssignmentController/indext';
import {
    authenticateAdmin,
    authenticateMember,
    authenticateMemberByRequest,
    authenticateToken,
} from '../controllers/AuthenticationController';
import {
    changeProjectName,
    createProject,
    getProjects,
    removeProject,
} from '../controllers/ProjectController';
import {
    changeTaskInfo,
    createTask,
    removeTask,
} from '../controllers/TaskController';
import validateRequest, {
    getProjectSchema,
    postAssignmentSchema,
    postProjectSchema,
    projectSchema,
    taskIDSchema,
    taskSchema,
    teamIDSchema,
    updateProjectSchema,
    updateTaskQuerySchema,
    updateTaskSchema,
    validateParams,
    validateQuery,
} from '../middleware/validateRequest';

const ProjectRoutes = Router();

ProjectRoutes.get(
    '/:team_id',
    validateParams(getProjectSchema),
    authenticateToken,
    authenticateMember,
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
    authenticateAdmin,
    removeProject,
);

ProjectRoutes.put(
    '/:team_id/:project_id/update-name',
    validateRequest(updateProjectSchema),
    validateParams(projectSchema),
    authenticateToken,
    authenticateAdmin,
    changeProjectName,
);

ProjectRoutes.post(
    '/:team_id/task',
    validateParams(teamIDSchema),
    validateRequest(taskSchema),
    authenticateToken,
    authenticateAdmin,
    createTask,
);

ProjectRoutes.delete(
    '/:team_id/task/:task_id',
    validateParams(taskIDSchema),
    authenticateToken,
    authenticateAdmin,
    removeTask,
);

ProjectRoutes.put(
    '/:team_id/task/:task_id',
    validateParams(taskIDSchema),
    validateQuery(updateTaskQuerySchema),
    validateRequest(updateTaskSchema),
    authenticateToken,
    authenticateAdmin,
    changeTaskInfo,
);

ProjectRoutes.post(
    '/:team_id/task/:task_id/assignment',
    validateParams(taskIDSchema),
    validateRequest(postAssignmentSchema),
    authenticateToken,
    authenticateAdmin,
    authenticateMemberByRequest,
    createAssignment,
);

export default ProjectRoutes;
