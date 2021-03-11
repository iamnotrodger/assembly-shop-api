import { Router } from 'express';
import { logIDSchema } from '../config/joiSchemas';
import { deleteLog } from '../controller/LogController';
import { authenticateToken } from '../middleware/authentication';
import { validateParams } from '../middleware/validateRequest';

const LogRoutes = Router();

LogRoutes.delete(
    '/:logID',
    validateParams(logIDSchema),
    authenticateToken,
    //TODO: validate log actions
    deleteLog,
);

export default LogRoutes;
