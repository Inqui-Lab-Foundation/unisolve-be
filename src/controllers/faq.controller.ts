import { faqSchema,faqSchemaUpdateSchema } from "../validations/faq.validation";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class FaqController extends BaseController {

    model = "faq";

    protected initializePath(): void {
        this.path = '/faqs';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(faqSchema,faqSchemaUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
        
        
    }
}