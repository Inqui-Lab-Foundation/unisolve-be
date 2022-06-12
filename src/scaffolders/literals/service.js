const string_ = require('../helpers/string');

function literal(resource) {
const resourceSingular = string_.singularizer(resource);
const resourceDenormalized = string_.denormalizer(resource);

  return `
import { Boom, conflict, notFound }  from '@hapi/boom';

import ${resourceDenormalized} from '../models/${resourceSingular}';
import authService from './auth.service';
import BaseService from '../base/baseService';

class ${resourceDenormalized}Service extends BaseService{

  getModelInstance(attrsObj){
    return new ${resourceDenormalized}(attrsObj);
  }

  getModel(){
    return ${resourceDenormalized};
  }

}
export default ${resourceDenormalized}Service;
`;
}

module.exports = literal