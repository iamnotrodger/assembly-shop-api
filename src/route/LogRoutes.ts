import { Router } from 'express';
import { logIDSchema, taskIDSchema } from '../config/joiSchemas';
import {
    deleteLog,
    getLogs,
    startLog,
    stopLog,
    validateTaskBelongsToUser,
} from '../controller/LogController';
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
    baseURI,
    validateParams(taskIDSchema),
    authenticateToken,
    validateTaskBelongsToUser,
    startLog,
);

LogRoutes.put(
    baseURI + '/:logID',
    validateParams(logIDSchema),
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