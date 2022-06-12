const string_ = require('../helpers/string');

function literal(resource) {
const resourceSingular = string_.singularizer(resource);
const resourceDenormalized = string_.denormalizer(resource);

  return `
  import Joi from 'joi';

  export const ${resourceSingular}Schema = Joi.object().keys({
      name: Joi.string().required(),
      desc: Joi.string().required(),
  });
  
  export const ${resourceSingular}UpdateSchema = Joi.object().keys({
      status: Joi.string().valid('Completed', 'Incomplete'),
  });

`;
}

module.exports = literal