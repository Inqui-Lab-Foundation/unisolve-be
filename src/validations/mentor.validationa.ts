import Joi from 'joi';
import { constents } from '../configs/constents.config';
import { speeches } from '../configs/speeches.config';

export const mentorSchema = Joi.object().keys({
    username: Joi.string().required().messages({
        'string.empty': speeches.USER_USERNAME_REQUIRED
    }),
    full_name: Joi.string().required().messages({
        'string.empty': speeches.USER_FULLNAME_REQUIRED
    }),
    role: Joi.string().required().messages({
        'string.empty': speeches.USER_ROLE_REQUIRED
    }),
    team_id: Joi.string().required().messages({
        'string.empty': speeches.USER_TEAMID_REQUIRED
    }),
    organization_code: Joi.string().required().messages({
        'string.empty': speeches.USER_ORGANIZATION_CODE_REQUIRED
    }),
    qualification: Joi.string().required().messages({
        'string.empty': speeches.USER_QUALIFICATION_REQUIRED
    })
});

export const mentorLoginSchema = Joi.object().keys({
    username: Joi.string().required().messages({
        'string.empty': speeches.USER_USERNAME_REQUIRED
    }),
    password: Joi.string().required().messages({
        'string.empty': speeches.USER_PASSWORD_REQUIRED
    })
});
export const mentorChangePasswordSchema = Joi.object().keys({
    user_id: Joi.string().required().messages({
        'string.empty': speeches.USER_USERID_REQUIRED
    }),
    old_password: Joi.string().required().messages({
        'string.empty': speeches.USER_OLDPASSWORD_REQUIRED
    }),
    new_password: Joi.string().required().messages({
        'string.empty': speeches.USER_NEWPASSWORD_REQUIRED
    })
});

export const mentorUpdateSchema = Joi.object().keys({
    status: Joi.string().valid(...Object.values(constents.common_status_flags.list))
});