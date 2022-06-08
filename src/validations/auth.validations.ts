import Joi from 'joi';
import { speeches } from '../configs/speeches.config';

const login = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const register = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    mobile: Joi.string().required(),
    qualification: Joi.string().required(),
    created_by: Joi.number().required(),
});

export default { login, register };