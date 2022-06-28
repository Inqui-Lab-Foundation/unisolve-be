
import { userTopicProgressSchema, userTopicProgressUpdateSchema,  } from "../validations/userTopicProgress.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class UserTopicProgress extends BaseController {

    model = "user_topic_progress";

    protected initializePath(): void {
        this.path = '/userTopicProgress';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(userTopicProgressSchema,userTopicProgressUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(this.path+"/", this.getData);
        super.initializeRoutes();
    }
} 
