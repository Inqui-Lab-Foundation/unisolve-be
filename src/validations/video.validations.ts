import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const videoSchema = Joi.object().keys({
    module: Joi.string().required().messages({
        'string.empty': speeches.NAME_REQUIRED
    }),
    video_stream_id: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
});

export const videoUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.task_status_flags.list)).required().messages({
        'any.only': speeches.NOTIFICATION_STATUS_INVALID,
        'string.empty': speeches.NOTIFICATION_STATUS_REQUIRED
    }),
});