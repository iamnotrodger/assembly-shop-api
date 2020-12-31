import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';

/** If a Request is made to a route that does not exist it will be redirected to this middleware */
const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new HttpException(404, 'Not found.'));
};

export default notFound;
