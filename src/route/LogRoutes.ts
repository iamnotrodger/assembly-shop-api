import { Router } from 'express';
import { logIDSchema, taskIDSchema } from '../config/joiSchemas';
import {
    deleteLog,
    getLogs,
    startLog,
    stopLog,
} from '../controller/LogController';
import { validateTaskBelongsToUser } from '../controller/TaskController';
import {
    authenticateMember,
    authenticateToken,
} from '../middleware/authentication';
import { validateParams } from '../middleware/validateRequest';

const LogRoutes = Router();
const baseURI = '/team/:teamID/project/:projectID/task/:taskID/log';

LogRoutes.get(
    baseURI,
    validateParams(taskIDSchema),
    authenticateToken,
    authenticateMember,
    getLogs,
);

LogRoutes.post(
    baseURI + '/start',
    validateParams(taskIDSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    startLog,
);

LogRoutes.put(
    baseURI + '/stop',
    validateParams(taskIDSchema),
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
