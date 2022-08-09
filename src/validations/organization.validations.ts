import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const organizationSchema = Joi.object().keys({
    details: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    organization_code: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
    organization_name: Joi.string().required().messages({
        'string.empty': speeches.ID_REQUIRED
    }),
});

export const organizationUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list)).required().messages({
        'any.only': speeches.COMMON_STATUS_INVALID,
        'string.empty': speeches.COMMON_STATUS_REQUIRED
    }),
});
export const organizationCheckSchema = Joi.object().keys({
    organization_code: Joi.string().required().messages({
        'string.empty': speeches.ORG_CODE_REQUIRED
    }),
});