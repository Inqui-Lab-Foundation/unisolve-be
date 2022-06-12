const string_ = require('../helpers/string');

function literal(resource) {
const resourceSingular = string_.singularizer(resource);
const resourceDenormalized = string_.denormalizer(resource);

  return `
  export interface ${resourceSingular}Attributes {
    ${resourceSingular}_id: number;
    name: string;
    description: string;
    status: Enumerator;
  }
  
`;
}

module.exports = literal