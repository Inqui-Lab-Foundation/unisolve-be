import { faqSchema,faqSchemaUpdateSchema } from "../validations/faq.validation";
import { quizQuestionSchema, quizQuestionSchemaUpdateSchema } from "../validations/quizQuestions.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class QuizQuestionsController extends BaseController {

    model = "quiz_question";

    protected initializePath(): void {
        this.path = '/quizQuestions';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(quizQuestionSchema,quizQuestionSchemaUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    }
}