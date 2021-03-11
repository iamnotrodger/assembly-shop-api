import { Router } from 'express';
import { logIDSchema } from '../config/joiSchemas';
import { deleteLog } from '../controller/LogController';
import {
    authenticateLogAction,
    authenticateToken,
} from '../middleware/authentication';
import { validateParams } from '../middleware/validateRequest';

const LogRoutes = Router();

LogRoutes.delete(
    '/:logID',
    validateParams(logIDSchema),
    authenticateToken,
    authenticateLogAction,
    deleteLog,
);

export default LogRoutes;
