import BaseController from "./base.controller";

export default class VideoController extends BaseController {

    model = "video";

    protected initializePath(): void {
        this.path = '/videos';
    }
    
    protected initializeRoutes(): void {
        super.initializeRoutes();
        
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
    }
}