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
            const message: string = details.map((i) => i.message).join(',');
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
            const message: string = details.map((i) => i.message).join(',');
            next(new NotFoundException(message));
        } else {
            next();
        }
    };
};

//Team Schemas + Team Members

export const teamIDSchema = Joi.object().keys({
    team_id: Joi.number().required(),
});

export const teamSchema = Joi.object().keys({
    name: Joi.string().required(),
});

export const memberIDSchema = Joi.object().keys({
    user_id: Joi.number().required(),
});

export const memberSchema = Joi.object().keys({
    team_id: Joi.number().required(),
    user_id: Joi.number().required(),
});

// Project Schemas

export const projectSchema = Joi.object().keys({
    project_id: Joi.number().required(),
    team_id: Joi.number().required(),
});

export const getProjectSchema = Joi.object().keys({
    team_id: Joi.number().required(),
});

export const postProjectSchema = Joi.object().keys({
    team_id: Joi.number().required(),
    name: Joi.string().required(),
});

export const updateProjectSchema = Joi.object().keys({
    name: Joi.string().required(),
});

// Task Schemas

export const taskSchema = Joi.object().keys({
    project_id: Joi.number().required(),
    title: Joi.string().required(),
    context: Joi.string(),
});

export const taskIDSchema = Joi.object().keys({
    team_id: Joi.number().required(),
    task_id: Joi.number().required(),
});

export default validateRequest;
