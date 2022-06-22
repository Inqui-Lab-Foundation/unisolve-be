
import { userCtopicProgressSchema, userCtopicProgressUpdateSchema,  } from "../validations/userCtopicProgress.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class UserCtopicProgressController extends BaseController {

    model = "user_ctopic_progress";

    protected initializePath(): void {
        this.path = '/userCtopicProgress';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(userCtopicProgressSchema,userCtopicProgressUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(this.path+"/", this.getData);
        super.initializeRoutes();
    }
} 
