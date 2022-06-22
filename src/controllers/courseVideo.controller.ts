
import { courseVideoSchema, courseVideoUpdateSchema } from "../validations/courseVideo.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class CourseVideoController extends BaseController {

    model = "course_video";

    protected initializePath(): void {
        this.path = '/courseVideos';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(courseVideoSchema,courseVideoUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(this.path+"/", this.getData);
        super.initializeRoutes();
    }
} 
