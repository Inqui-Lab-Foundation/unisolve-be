
  import Joi from 'joi';

  export const courseWorksheetSchema = Joi.object().keys({
      name: Joi.string().required(),
      desc: Joi.string().required(),
  });
  
  export const courseWorksheetUpdateSchema = Joi.object().keys({
      status: Joi.string().valid('Completed', 'Incomplete'),
  });

