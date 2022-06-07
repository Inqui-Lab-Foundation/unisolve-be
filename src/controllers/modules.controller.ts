import BaseController from "./base.controller";

export default class ModulesController extends BaseController {

    model = "modules";

    protected initializePath(): void {
        this.path = '/modules';
    }
    
    protected initializeRoutes(): void {
        super.initializeRoutes();
        
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
    }
}