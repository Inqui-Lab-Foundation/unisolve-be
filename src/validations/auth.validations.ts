import Joi from 'joi';
import { speeches } from '../configs/speeches.config';

const login = Joi.object().keys({
    email: Joi.string().email().required().messages(
        {
            'string.empty': speeches.USER_EMAIL_REQUIRED,
            'string.email': speeches.USER_EMAIL_INVALID,
        }
    ),
    password: Joi.string().required().messages(
        {
            'string.empty': speeches.USER_PWD_REQUIRED,
        }
    )
});

const register = Joi.object().keys({
    email: Joi.string().email().required().messages({
        'string.empty': speeches.USER_EMAIL_REQUIRED
    }),
    password: Joi.string().required().messages({
        'string.empty': speeches.USER_PWD_REQUIRED
    }),
    mobile: Joi.string().required().messages({
        'string.empty': speeches.MOBILE_NUMBER_REQUIRED
    }),
    qualification: Joi.string().required().messages({
        'string.empty': speeches.USER_QUALIFICATION_REQUIRED
    }),
    created_by: Joi.number().required().messages({
        'string.empty': speeches.CREATED_BY_REQUIRED
    })
});

export default { login, register };