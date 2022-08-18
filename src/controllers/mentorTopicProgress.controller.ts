
import { mentorTopicProgressSchema, mentorTopicProgressUpdateSchema } from "../validations/mentorTopicProgress.validations";
import { userTopicProgressSchema, userTopicProgressUpdateSchema,  } from "../validations/userTopicProgress.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class MentorTopicProgressController extends BaseController {

    model = "mentor_topic_progress";

    protected initializePath(): void {
        this.path = '/mentorTopicProgress';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(mentorTopicProgressSchema,mentorTopicProgressUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(this.path+"/", this.getData);
        super.initializeRoutes();
    }
} 
