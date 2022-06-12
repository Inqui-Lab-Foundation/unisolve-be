const string_ = require('../helpers/string');

function literal(resource) {
const resourceSingular = string_.singularizer(resource);
const resourceDenormalized = string_.denormalizer(resource);

  return `
import { ${resourceSingular}Schema, ${resourceSingular}UpdateSchema } from "../validations/${resourceSingular}.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class ${resourceDenormalized}Controller extends BaseController {

    model = "${resourceSingular}";

    protected initializePath(): void {
        this.path = '/${resourceSingular}';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(${resourceSingular}Schema,${resourceSingular}UpdateSchema);
    }
    protected initializeRoutes(): void {
        super.initializeRoutes();
        
        //example route to add 
        //this.router.get(this.path+"/", this.getData);
    }
} 
`;
}

module.exports = literal