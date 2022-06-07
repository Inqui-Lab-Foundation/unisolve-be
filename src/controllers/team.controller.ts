import BaseController from "./base.controller";

export default class TeamController extends BaseController {

    model = "team";

    protected initializePath(): void {
        this.path = '/teams';
    }
    
    protected initializeRoutes(): void {
        super.initializeRoutes();
        
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
    }
}