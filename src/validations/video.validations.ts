import Joi from 'joi';

export const videoSchema = Joi.object().keys({
    module: Joi.string().required(),
    video_stream_id: Joi.string().required(),
});

export const videoUpdateSchema = Joi.object().keys({
    status: Joi.string().valid('Completed', 'Incomplete'),
});