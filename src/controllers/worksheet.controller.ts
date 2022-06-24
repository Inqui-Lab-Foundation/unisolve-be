
import { worksheetSchema, worksheetUpdateSchema } from "../validations/worksheet.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class WorksheetController extends BaseController {

    model = "worksheet";

    protected initializePath(): void {
        this.path = '/worksheets';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(worksheetSchema,worksheetUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(this.path+"/", this.getData);
        super.initializeRoutes();
    }
} 
