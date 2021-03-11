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
    setTaskCompleted,
    setTaskIncomplete,
    updateTaskInfo,
    validateAssignee,
    validateAssigneeByTeamID,
    validateTaskAction,
    validateTaskBelongsToUser,
} from '../controller/TaskController';
import {
    authenticateTeamMember,
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
    authenticateTeamMember,
    getTasks,
);

//Create Task
TaskRoutes.post(
    baseURI,
    validateParams(projectSchema),
    validateRequest(taskSchema),
    authenticateToken,
    authenticateTeamMember,
    validateAssigneeByTeamID,
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

export default TaskRoutes;
