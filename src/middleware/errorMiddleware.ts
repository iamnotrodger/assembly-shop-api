import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

/** The Request gets re-routed to this Middleware if an Error is ever thrown */
const errorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    console.log(message);
    res.status(status).send(message);
};

export default errorMiddleware;
