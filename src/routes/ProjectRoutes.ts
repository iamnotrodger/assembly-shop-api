import { Router } from 'express';
import {
    authenticateAssignment,
    createAssignment,
    removeAssignment,
} from '../controllers/AssignmentController/indext';
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
    assignmentIDSchema,
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
    '/:team_id/:project_id/task/:task_id/assignment',
    validateParams(assignmentIDSchema),
    validateRequest(postAssignmentSchema),
    authenticateToken,
    authenticateAdmin,
    authenticateAssignment,
    authenticateMemberByRequest,
    createAssignment,
);

ProjectRoutes.delete(
    '/:team_id/:project_id/task/:task_id/assignment/',
    validateParams(assignmentIDSchema),
    authenticateToken,
    authenticateAdmin,
    authenticateAssignment,
    removeAssignment,
);

export default ProjectRoutes;
