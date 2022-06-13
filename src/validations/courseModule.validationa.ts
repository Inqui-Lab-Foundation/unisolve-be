import Joi from 'joi';

export const courseModuleSchema = Joi.object().keys({
    course_id: Joi.string().required(),
    description: Joi.string().required(),
});

export const courseModuleUpdateSchema = Joi.object().keys({
    status: Joi.string().valid('Completed', 'Incomplete'),
});