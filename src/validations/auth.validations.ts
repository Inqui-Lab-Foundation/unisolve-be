import Joi from 'joi';

const login = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const register = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export default { login, register };