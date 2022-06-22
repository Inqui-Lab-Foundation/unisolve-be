
  import Joi from 'joi';

  export const userCtopicProgressSchema = Joi.object().keys({
      user_id: Joi.string().required(),
      course_topic_id: Joi.string().required(),
      status: Joi.string().valid('Completed', 'Incomplete'),
  });
  
  export const userCtopicProgressUpdateSchema = Joi.object().keys({
      status: Joi.string().valid('Completed', 'Incomplete'),
  });

