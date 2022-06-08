import Joi from 'joi';

export const courseSchema = Joi.object().keys({
    name: Joi.string().required(),
    desc: Joi.string().required(),
});