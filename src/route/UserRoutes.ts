import { Router } from 'express';
import { userEmailSchema } from '../config/joiSchemas';
import { getUsersByEmail } from '../controller/UserController';
import { validateQuery } from '../middleware/validateRequest';

const UserRoutes = Router();

UserRoutes.get('/find', validateQuery(userEmailSchema), getUsersByEmail);

export default UserRoutes;
