import { Router } from 'express';
import {
    assignTaskSchema,
    projectSchema,
    taskIDSchema,
    taskSchema,
    updateTaskQuerySchema,
    updateTaskSchema,
} from '../config/joiSchemas';
import {
    assignTask,
    createTask,
    deleteTask,
    getTasks,
    updateTaskInfo,
} from '../controller/TaskController';
import {
    setTaskCompleted,
    setTaskIncomplete,
    validateTaskAction,
    validateTaskBelongsToUser,
    verifyAssigneeIsTeamMember,
} from '../controller/TaskController/TaskController';
import {
    authenticateMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, {
    validateParams,
    validateQuery,
} from '../middleware/validateRequest';

const TaskRoutes = Router();
const baseURI = '/team/:teamID/project/:projectID/task';

//Get Task
TaskRoutes.get(
    baseURI,
    validateParams(projectSchema),
    authenticateToken,
    authenticateMember,
    getTasks,
);

//Create Task
TaskRoutes.post(
    baseURI,
    validateParams(projectSchema),
    validateRequest(taskSchema),
    authenticateToken,
    authenticateMember,
    verifyAssigneeIsTeamMember,
    createTask,
);

//Delete Task
TaskRoutes.delete(
    '/task/:taskID',
    validateParams(taskIDSchema),
    authenticateToken,
    validateTaskAction,
    deleteTask,
);

//Update Task, has query fields
TaskRoutes.put(
    '/task/:taskID',
    validateParams(taskIDSchema),
    validateQuery(updateTaskQuerySchema),
    validateRequest(updateTaskSchema),
    authenticateToken,
    validateTaskAction,
    updateTaskInfo,
);

//Assign Task
TaskRoutes.put(
    '/:taskID/assign',
    validateParams(taskIDSchema),
    validateRequest(assignTaskSchema),
    authenticateToken,
    validateTaskAction,
    verifyAssigneeIsTeamMember,
    assignTask,
);

//Set Task Completed
TaskRoutes.put(
    '/task/:taskID/complete',
    validateParams(taskIDSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    setTaskCompleted,
);

//Set Task Incomplete
TaskRoutes.put(
    '/task/:taskID/incomplete',
    validateParams(taskIDSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    setTaskIncomplete,
);

export default TaskRoutes;
