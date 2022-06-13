import ValidationsHolder from "../validations/validationHolder";
import { videoSchema, videoUpdateSchema } from "../validations/video.validations";
import BaseController from "./base.controller";

export default class VideoController extends BaseController {

    model = "video";

    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(videoSchema,videoUpdateSchema);
    }
    protected initializePath(): void {
        this.path = '/videos';
    }
    
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    }
}