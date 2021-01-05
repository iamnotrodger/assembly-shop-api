import { Router } from 'express';
import {
    createAssignment,
    removeAssignment,
} from '../controllers/AssignmentController/indext';
import {
    authenticateAdmin,
    authenticateMember,
    authenticateMemberByRequest,
    authenticateProjectAdmin,
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
    postAssignmentSchema,
    postProjectSchema,
    projectIDSchema,
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

//Get Team Projects
ProjectRoutes.get(
    '/:team_id',
    validateParams(teamIDSchema),
    authenticateToken,
    authenticateMember,
    getProjects,
);

//Create Project
ProjectRoutes.post(
    '',
    validateRequest(postProjectSchema),
    authenticateToken,
    authenticateAdmin,
    createProject,
);

//Delete Project
ProjectRoutes.delete(
    '/:project_id',
    validateParams(projectIDSchema),
    authenticateToken,
    authenticateProjectAdmin,
    removeProject,
);

//Update Project's Name
ProjectRoutes.put(
    '/:project_id/update-name',
    validateParams(projectIDSchema),
    validateRequest(updateProjectSchema),
    authenticateToken,
    authenticateProjectAdmin,
    changeProjectName,
);

//Create Task
ProjectRoutes.post(
    '/:project_id/task',
    validateParams(projectIDSchema),
    validateRequest(taskSchema),
    authenticateToken,
    authenticateProjectAdmin,
    createTask,
);

//Delete Task
ProjectRoutes.delete(
    '/:project_id/task/:task_id',
    validateParams(taskIDSchema),
    authenticateToken,
    authenticateProjectAdmin,
    removeTask,
);

//Update Task, has query fields
ProjectRoutes.put(
    '/:project_id/task/:task_id',
    validateParams(taskIDSchema),
    validateQuery(updateTaskQuerySchema),
    validateRequest(updateTaskSchema),
    authenticateToken,
    authenticateProjectAdmin,
    changeTaskInfo,
);

//Create Assignment
ProjectRoutes.post(
    '/:project_id/task/:task_id/assignment',
    validateParams(taskIDSchema),
    validateRequest(postAssignmentSchema),
    authenticateToken,
    authenticateProjectAdmin,
    authenticateMemberByRequest,
    createAssignment,
);

//Delete Assignment
ProjectRoutes.delete(
    '/:project_id/task/:task_id/assignment',
    validateParams(taskIDSchema),
    authenticateToken,
    authenticateProjectAdmin,
    removeAssignment,
);

export default ProjectRoutes;
