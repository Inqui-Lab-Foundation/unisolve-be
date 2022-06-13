import Joi from 'joi';

export const teamSchema = Joi.object().keys({
    mentor_id: Joi.string().required(),
    team_name: Joi.string().required(),
});

export const teamUpdateSchema = Joi.object().keys({
    status: Joi.string().valid('Active', 'Inactive'),
});