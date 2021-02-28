import Joi from 'joi';

// User Schema
export const nameSchema = Joi.object().keys({
    name: Joi.string().required(),
});

export const userIDSchema = Joi.object().keys({
    userID: Joi.number().required(),
});

export const userEmailSchema = Joi.object().keys({
    email: Joi.string().required(),
});

//Team + Members Schemas

export const teamIDSchema = Joi.object().keys({
    teamID: Joi.number().required(),
});
export const memberSchema = userIDSchema.concat(teamIDSchema);

export const teamSchema = nameSchema.keys({
    members: Joi.array().items(userIDSchema),
});

// Project Schemas

export const projectIDSchema = Joi.object().keys({
    projectID: Joi.number().required(),
});

export const projectSchema = projectIDSchema.concat(teamIDSchema);

// Task Schemas

export const taskSchema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    assignee: userIDSchema,
});

export const taskIDSchema = projectSchema.keys({
    taskID: Joi.number().required(),
});

export const assignTaskSchema = Joi.object().keys({
    assignee: userIDSchema,
});

export const updateTaskQuerySchema = Joi.object().keys({
    field: Joi.string().valid('title', 'description').required(),
});

export const updateTaskSchema = Joi.object().keys({
    newValue: Joi.string().required(),
});

// Log Schemas

export const logIDSchema = taskIDSchema.keys({
    logID: Joi.number().required(),
});
