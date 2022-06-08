import Joi from 'joi';
import { speeches } from '../configs/speeches.config';

const login = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const register = Joi.object().keys({
    email: Joi.string().email().required().messages({
        'string.empty': speeches.EMAIL_IS_EMPTY
      }),
    password: Joi.string().required(),
    full_name: Joi.string().required(),
    mobile: Joi.string().required(),
    role:Joi.string().required(),
    qualification: Joi.string().required(),
});

export default { login, register };