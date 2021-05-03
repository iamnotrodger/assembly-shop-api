import { Router } from 'express';
import {
    logTimeSchema,
    taskAssigneeSchema,
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
    validateAssigneeOnCreate,
} from '../controller/TaskController';
import {
    authenticateProjectMember,
    authenticateTaskAction,
    authenticateTaskMember,
    authenticateToken,
} from '../middleware/authentication';
import validateRequest, {
    validateParams,
    validateQuery,
} from '../middleware/validateRequest';

const TaskRoutes = Router();

//Create Task
TaskRoutes.post(
    '',
    validateRequest(taskSchema),
    authenticateToken,
    authenticateProjectMember,
    validateAssigneeOnCreate,
    createTask,
);

//Delete Task
TaskRoutes.delete(
    '/:taskID',
    validateParams(taskIDSchema),
    authenticateToken,
    authenticateTaskAction,
    deleteTask,
);

//Update Task, has query fields
TaskRoutes.put(
    '/:taskID',
    validateParams(taskIDSchema),
    validateQuery(updateTaskQuerySchema),
    validateRequest(updateTaskSchema),
    authenticateToken,
    authenticateTaskAction,
    updateTaskInfo,
);

//Assign Task
TaskRoutes.put(
    '/:taskID/assign',
    validateParams(taskIDSchema),
    validateRequest(taskAssigneeSchema),
    authenticateToken,
    authenticateTaskAction,
    validateAssignee,
    assignTask,
);

//Set Task Completed
TaskRoutes.put(
    '/:taskID/complete',
    validateParams(taskIDSchema),
    authenticateToken,
    authenticateTaskAction,
    setTaskCompleted,
);

//Set Task Incomplete
TaskRoutes.put(
    '/:taskID/incomplete',
    validateParams(taskIDSchema),
    authenticateToken,
    authenticateTaskAction,
    setTaskIncomplete,
);

//Start Task
TaskRoutes.post(
    '/:taskID/start',
    validateParams(taskIDSchema),
    validateRequest(logTimeSchema),
    authenticateToken,
    authenticateTaskAction,
    startLog,
);

//Stop Task
TaskRoutes.put(
    '/:taskID/stop',
    validateParams(taskIDSchema),
    validateRequest(logTimeSchema),
    authenticateToken,
    authenticateTaskAction,
    stopLog,
);

//Get task logs
TaskRoutes.get(
    '/:taskID/log',
    validateParams(taskIDSchema),
    authenticateToken,
    authenticateTaskMember,
    getLogs,
);

export default TaskRoutes;
