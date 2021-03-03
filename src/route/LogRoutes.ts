import { Router } from 'express';
import {
    logIDSchema,
    logTaskIDSchema,
    taskIDSchema,
} from '../config/joiSchemas';
import {
    deleteLog,
    getLogs,
    startLog,
    stopLog,
} from '../controller/LogController';
import { validateTaskBelongsToUser } from '../controller/TaskController';
import { authenticateToken } from '../middleware/authentication';
import { validateParams } from '../middleware/validateRequest';

const LogRoutes = Router();
const baseURI = '/task/:taskID/log';

LogRoutes.get(
    baseURI,
    validateParams(taskIDSchema),
    authenticateToken,
    getLogs,
);

LogRoutes.post(
    baseURI + '/start',
    validateParams(logTaskIDSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    startLog,
);

LogRoutes.put(
    baseURI + '/stop',
    validateParams(logTaskIDSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    stopLog,
);

LogRoutes.delete(
    baseURI + '/:logID',
    validateParams(logIDSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    deleteLog,
);

export default LogRoutes;
