import Joi from 'joi';

export const courseSchema = Joi.object().keys({
    name: Joi.string().required(),
    desc: Joi.string().required(),
});

export const courseUpdateSchema = Joi.object().keys({
    status: Joi.string().valid('Completed', 'Incomplete'),
});