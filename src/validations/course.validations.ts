import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const courseSchema = Joi.object().keys({
    title: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    description: Joi.string().required().messages({
        'string.empty': speeches.DESCRIPTION_REQUIRED
    }),
});

export const courseUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.task_status_flags.list)).required().messages({
        'any.only': speeches.NOTIFICATION_STATUS_INVALID,
        'string.empty': speeches.NOTIFICATION_STATUS_REQUIRED
    })
});