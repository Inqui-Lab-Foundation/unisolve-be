
import { courseWorksheetSchema, courseWorksheetUpdateSchema } from "../validations/courseWorksheet.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class CourseWorksheetController extends BaseController {

    model = "course_worksheet";

    protected initializePath(): void {
        this.path = '/courseWorksheets';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(courseWorksheetSchema,courseWorksheetUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(this.path+"/", this.getData);
        super.initializeRoutes();
    }
} 
