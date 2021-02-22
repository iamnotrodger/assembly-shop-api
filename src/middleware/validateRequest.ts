import { Schema } from 'joi';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import InvalidRequestException from '../exceptions/InvalidRequestException';
import NotFoundException from '../exceptions/NotFoundException';

//Middleware to check the Request Body Object
const validateRequest = (schema: Schema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const { details } = error;
            const message: string =
                'Invalid Request: Invalid JSON. ' +
                details.map((i) => i.message).join(',');
            next(new InvalidRequestException(message));
        } else {
            next();
        }
    };
};

//Middleware to check Request Params Object
export const validateParams = (schema: Schema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.params);
        if (error) {
            const { details } = error;
            const message: string =
                'Invalid Request: Invalid URL parameters. ' +
                details.map((i) => i.message).join(',');
            next(new NotFoundException(message));
        } else {
            next();
        }
    };
};

export const validateQuery = (schema: Schema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.query);
        if (error) {
            const { details } = error;
            const message: string =
                'Invalid Request: Invalid URL query. ' +
                details.map((i) => i.message).join(',');
            next(new InvalidRequestException(message));
        } else {
            next();
        }
    };
};

export default validateRequest;
