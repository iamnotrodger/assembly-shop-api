import { Router } from 'express';
import {
    authenticateAdminByParams,
    authenticateToken,
} from '../controllers/AuthenticationController';
import { createTask } from '../controllers/TaskController';
import validateRequest, {
    taskSchema,
    teamIDSchema,
    validateParams,
} from '../middleware/validateRequest';

const TaskRoutes = Router();

TaskRoutes.post(
    '/:team_id',
    validateParams(teamIDSchema),
    validateRequest(taskSchema),
    authenticateToken,
    authenticateAdminByParams,
    createTask,
);

export default TaskRoutes;
