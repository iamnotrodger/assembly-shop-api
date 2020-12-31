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

export const validateQuery = (schema: Schema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.query);
        if (error) {
            const { details } = error;
            const message: string = details.map((i) => i.message).join(',');
            next(new InvalidRequestException(message));
        } else {
            next();
        }
    };
};

export const storySchema = Joi.object().keys({
    chapter: Joi.number().required(),
    title: Joi.string().max(60).required(),
    caption: Joi.string().max(2200),
    src: Joi.string().required(),
});

export const postSchema = Joi.object().keys({
    title: Joi.string().max(60).required(),
    thumbnail: Joi.string(),
    stories: Joi.array().items(storySchema).required(),
});

export const usernameSchema = Joi.object().keys({
    username: Joi.string().max(30).required(),
});

export const likeSchema = Joi.object().keys({
    activity_id: Joi.number().required(),
});

export const commentSchema = Joi.object().keys({
    post_id: Joi.number().required(),
    content: Joi.string().max(2200).required(),
});

export const editCommentSchema = Joi.object().keys({
    comment_id: Joi.number().required(),
    content: Joi.string().max(2200).required(),
});

export const postParamsSchema = Joi.object().keys({
    post_id: Joi.number().required(),
});

export const userParamsSchema = Joi.object().keys({
    user_id: Joi.number().required(),
});

export const paginateQuerySchema = Joi.object().keys({
    limit: Joi.number(),
    from: Joi.number(),
});

export default validateRequest;
