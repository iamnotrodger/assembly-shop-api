import Joi, { Schema } from 'joi';
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

// User Schema
export const nameSchema = Joi.object().keys({
    name: Joi.string().required(),
});

export const userIDSchema = Joi.object().keys({
    userID: Joi.number().required(),
});

//Team + Members Schemas

export const teamIDSchema = Joi.object().keys({
    teamID: Joi.number().required(),
});
export const memberSchema = userIDSchema.concat(teamIDSchema);

// Project Schemas

export const projectIDSchema = Joi.object().keys({
    projectID: Joi.number().required(),
});

export const projectSchema = projectIDSchema.concat(teamIDSchema);

// Task Schemas

export const taskSchema = Joi.object().keys({
    title: Joi.string().required(),
    context: Joi.string(),
});

export const taskIDSchema = Joi.object().keys({
    projectID: Joi.number().required(),
    task_id: Joi.number().required(),
});

export const updateTaskQuerySchema = Joi.object().keys({
    field: Joi.string().valid('title', 'context').required(),
});

export const updateTaskSchema = Joi.object().keys({
    newValue: Joi.string().required(),
});

export const taskStatusQuery = Joi.object().keys({
    status: Joi.string().valid('ONGOING', 'COMPLETED', 'UNASSIGNED'),
});

// Assignment Schemas

export const postAssignmentSchema = Joi.object().keys({
    userID: Joi.number().required(),
});

export default validateRequest;
