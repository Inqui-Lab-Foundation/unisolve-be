import { courseModuleSchema, courseModuleUpdateSchema } from "../validations/courseModule.validationa";
import { translationSchema, translationUpdateSchema } from "../validations/translation.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class TranslationController extends BaseController {

    model = "translation";

    protected initializePath(): void {
        this.path = '/translations';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(translationSchema,translationUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    }
}