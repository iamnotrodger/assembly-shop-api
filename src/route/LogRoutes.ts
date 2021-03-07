import { Router } from 'express';
import { logIDSchema, logTimeSchema, taskIDSchema } from '../config/joiSchemas';
import {
    deleteLog,
    getLogs,
    startLog,
    stopLog,
} from '../controller/LogController';
import { validateTaskBelongsToUser } from '../controller/TaskController';
import { validateTaskAction } from '../controller/TaskController/TaskController';
import { authenticateToken } from '../middleware/authentication';
import validateRequest, { validateParams } from '../middleware/validateRequest';

const LogRoutes = Router();
const baseURI = '/task/:taskID';

LogRoutes.post(
    baseURI + '/start',
    validateParams(taskIDSchema),
    validateRequest(logTimeSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    startLog,
);

LogRoutes.put(
    baseURI + '/stop',
    validateParams(taskIDSchema),
    validateRequest(logTimeSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    stopLog,
);

LogRoutes.get(
    baseURI + '/log',
    validateParams(taskIDSchema),
    authenticateToken,
    validateTaskAction,
    getLogs,
);

LogRoutes.delete(
    baseURI + '/log/:logID',
    validateParams(logIDSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    deleteLog,
);

export default LogRoutes;
