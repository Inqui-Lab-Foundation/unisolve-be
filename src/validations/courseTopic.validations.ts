
  import Joi from 'joi';

  export const courseTopicSchema = Joi.object().keys({
      name: Joi.string().required(),
      desc: Joi.string().required(),
  });
  
  export const courseTopicUpdateSchema = Joi.object().keys({
      status: Joi.string().valid('Completed', 'Incomplete'),
  });

