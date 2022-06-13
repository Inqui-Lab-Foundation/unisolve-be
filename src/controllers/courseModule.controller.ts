import { courseModuleSchema, courseModuleUpdateSchema } from "../validations/courseModule.validationa";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class CourseModulesController extends BaseController {

    model = "modules";

    protected initializePath(): void {
        this.path = '/modules';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(courseModuleSchema,courseModuleUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    }
}