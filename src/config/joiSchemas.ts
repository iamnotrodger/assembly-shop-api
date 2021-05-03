import Joi from 'joi';

// User Schema
export const nameSchema = Joi.object().keys({
    name: Joi.string().required(),
});

export const userSchema = Joi.object().keys({
    userID: Joi.number().required(),
    providerID: Joi.string().allow(null),
    provider: Joi.string().allow(null),
    email: Joi.string().allow(null),
    name: Joi.string().allow(null),
    givenName: Joi.string().allow(null),
    familyName: Joi.string().allow(null),
    picture: Joi.string().allow(null),
    joined: Joi.date().allow(null),
});

export const userEmailSchema = Joi.object().keys({
    email: Joi.string().required(),
});

//Team + Members Schemas

export const teamIDSchema = Joi.object().keys({
    teamID: Joi.number().required(),
});
export const memberSchema = userSchema.concat(teamIDSchema);

export const teamSchema = nameSchema.keys({
    members: Joi.array().items(userSchema),
});

// Project Schemas

export const projectIDSchema = Joi.object().keys({
    projectID: Joi.number().required(),
});

export const projectSchema = Joi.object().keys({
    teamID: Joi.number().required(),
    name: Joi.string().required(),
});

// Task Schemas

export const taskAssigneeSchema = Joi.object().keys({
    memberID: Joi.number().required(),
});

export const taskSchema = Joi.object().keys({
    projectID: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    assignee: taskAssigneeSchema.allow(null),
});

export const taskIDSchema = Joi.object().keys({
    taskID: Joi.number().required(),
});

export const updateTaskQuerySchema = Joi.object().keys({
    field: Joi.string().valid('title', 'description').required(),
});

export const updateTaskSchema = Joi.object().keys({
    value: Joi.string().required(),
});

// Log Schemas

export const logIDSchema = Joi.object().keys({
    logID: Joi.number().required(),
});

export const logTimeSchema = Joi.object().keys({
    time: Joi.date().required(),
});
