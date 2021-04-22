import { Request, Response, Router } from 'express';

const HealthRoutes = Router();

const checkHealth = (req: Request, res: Response) => {
    res.send('ok');
};

HealthRoutes.get('', checkHealth);

export default HealthRoutes;
