import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const mentorCourseSchema = Joi.object().keys({
    title: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    description: Joi.string().required().messages({
        'string.empty': speeches.DESCRIPTION_REQUIRED
    }),
    thumbnail: Joi.string().allow(null),
});

export const mentorCourseUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).required().messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    })
});