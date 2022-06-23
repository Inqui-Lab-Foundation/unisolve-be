
  import Joi from 'joi';

  export const courseVideoSchema = Joi.object().keys({
      name: Joi.string().required(),
      desc: Joi.string().required(),
  });
  
  export const courseVideoUpdateSchema = Joi.object().keys({
      status: Joi.string().valid('Completed', 'Incomplete'),
  });

