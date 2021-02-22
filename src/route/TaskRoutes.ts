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
import { verifyAssigneeIsTeamMember } from '../controller/TaskController/TaskController';
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
    baseURI + '/:taskID',
    validateParams(taskIDSchema),
    authenticateToken,
    authenticateMember,
    deleteTask,
);

//Update Task, has query fields
TaskRoutes.put(
    baseURI + '/:taskID',
    validateParams(taskIDSchema),
    validateQuery(updateTaskQuerySchema),
    validateRequest(updateTaskSchema),
    authenticateToken,
    authenticateMember,
    updateTaskInfo,
);

//Assign Task
TaskRoutes.put(
    baseURI + '/:taskID/assign',
    validateParams(taskIDSchema),
    validateRequest(assignTaskSchema),
    authenticateToken,
    authenticateMember,
    verifyAssigneeIsTeamMember,
    assignTask,
);

export default TaskRoutes;
