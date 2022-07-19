import { faqCategorySchema,faqCategorySchemaUpdateSchema } from "../validations/faq_category.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class FaqCategoryController extends BaseController {

    model = "faq_category";

    protected initializePath(): void {
        this.path = '/faq_category';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(faqCategorySchema,faqCategorySchemaUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
        
        
    }
}