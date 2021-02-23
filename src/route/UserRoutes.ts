import { Router } from 'express';
import { userEmailSchema } from '../config/joiSchemas';
import { getUsersByEmail } from '../controller/UserController';
import { getUser } from '../controller/UserController/UserController';
import { authenticateToken } from '../middleware/authentication';
import { validateQuery } from '../middleware/validateRequest';

const UserRoutes = Router();

UserRoutes.get('', authenticateToken, getUser);

UserRoutes.get('/find', validateQuery(userEmailSchema), getUsersByEmail);

export default UserRoutes;
