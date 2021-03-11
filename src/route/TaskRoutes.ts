import { Router } from 'express';
import {
    assignTaskSchema,
    logTimeSchema,
    projectSchema,
    taskIDSchema,
    taskSchema,
    updateTaskQuerySchema,
    updateTaskSchema,
} from '../config/joiSchemas';
import { getLogs, startLog, stopLog } from '../controller/LogController';
import {
    assignTask,
    createTask,
    deleteTask,
    setTaskCompleted,
    setTaskIncomplete,
    updateTaskInfo,
    validateAssignee,
    validateTaskAction,
    validateTaskBelongsToUser,
} from '../controller/TaskController';
import {
    authenticateProjectMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, {
    validateParams,
    validateQuery,
} from '../middleware/validateRequest';

const TaskRoutes = Router();

//TODO: remove projectID from URI
//Create Task
TaskRoutes.post(
    '/project/:projectID',
    validateParams(projectSchema),
    validateRequest(taskSchema),
    authenticateToken,
    authenticateProjectMember,
    validateAssignee,
    createTask,
);

//Delete Task
TaskRoutes.delete(
    '/:taskID',
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
    '/task/:taskID/assign',
    validateParams(taskIDSchema),
    validateRequest(assignTaskSchema),
    authenticateToken,
    validateTaskAction,
    validateAssignee,
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

//Start Task
TaskRoutes.post(
    '/:taskID/start',
    validateParams(taskIDSchema),
    validateRequest(logTimeSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    startLog,
);

TaskRoutes.put(
    '/:taskID/stop',
    validateParams(taskIDSchema),
    validateRequest(logTimeSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    stopLog,
);

TaskRoutes.get(
    '/:taskID/log',
    validateParams(taskIDSchema),
    authenticateToken,
    validateTaskAction,
    getLogs,
);

export default TaskRoutes;
