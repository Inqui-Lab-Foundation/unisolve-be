import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const faqSchema = Joi.object().keys({
   
    faq_category_id: Joi.number().required().messages({
        'string.empty': speeches.FAQ_CATEGORY
    }),
    question: Joi.string().required().messages({
        'string.empty': speeches.QUESTION_REQUIRED
    }),
    answer: Joi.string().required().messages({
        'string.empty': speeches.FAQ_ANSWER
    })
});

export const faqSchemaUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).required().messages({
        'any.only': speeches.NOTIFICATION_STATUS_INVALID,
        'string.empty': speeches.NOTIFICATION_STATUS_REQUIRED
    })
});