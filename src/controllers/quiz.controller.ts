

import { badRequest, internal, unauthorized } from "boom";
import { NextFunction, Request, Response } from "express";
import { invalid } from "joi";
import { speeches } from "../configs/speeches.config";
import validationMiddleware from "../middlewares/validation.middleware";
import { quiz_question } from "../models/quiz_question.model";
import { quiz_response } from "../models/quiz_response.model";
import dispatcher from "../utils/dispatch.util";
import { quizNextQuestionSchema, quizSchema, quizSubmitResponseSchema, quizUpdateSchema } from "../validations/quiz.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class QuizController extends BaseController {

    model = "quiz";

    protected initializePath(): void {
        this.path = '/quiz';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(quizSchema,quizUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.get(this.path+"/:id/nextQuestion/",this.getNextQuestion.bind(this));
        this.router.post(this.path+"/:id/response/",validationMiddleware(quizSubmitResponseSchema),this.submitResponse.bind(this));
        super.initializeRoutes();
    }

    protected async  getNextQuestion(req:Request,res:Response,next:NextFunction): Promise<Response | void> {
        
        const  quiz_id  = req.params.id;
        const user_id =  res.locals.user_id;
        if(!quiz_id){
            throw badRequest(speeches.QUIZ_ID_REQUIRED);
        }
        if(!user_id){
            throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
        }
        const quizRes = await this.crudService.findOne(quiz_response,{where: {quiz_id:quiz_id,user_id:user_id}});
        if(quizRes instanceof Error){
            throw internal(quizRes.message)
        }
        let level = "HARD"
        let question_no = 1
        let nextQuestion:any=null;
        // console.log(quizRes)
        if(quizRes){
            //TOOO :: implement checking response and based on that change the 
            let user_response:any = {}
            user_response =  JSON.parse(quizRes.dataValues.response);
            // console.log(user_response);
            const noOfQuestionsAnswered = Object.keys(user_response).length
            // console.log(noOfQuestionsAnswered)
            const lastQuestionAnsewered = user_response[noOfQuestionsAnswered]
            if(lastQuestionAnsewered.selected_option == lastQuestionAnsewered.correct_answer){
                question_no = noOfQuestionsAnswered+1;

            }else{
                question_no = noOfQuestionsAnswered;
                if(lastQuestionAnsewered.level == "HARD"){
                    level = "MEDIUM"
                }else {
                    level = "EASY"
                }
            }
        }
        
        const nextQuestionsToChooseFrom = await this.crudService.findOne(quiz_question,{where:{quiz_id:quiz_id,level:level,question_no:question_no}})
        
        if(nextQuestionsToChooseFrom instanceof Error){
            throw internal(nextQuestionsToChooseFrom.message)
        }
        if(nextQuestionsToChooseFrom){
            res.status(200).send(dispatcher(nextQuestionsToChooseFrom))
        }else{
            res.status(200).send(dispatcher("Quiz has been completed no more questions to display"))
        }
        
    }

    protected async submitResponse(req:Request,res:Response,next:NextFunction) {
        try{
            
            const  quiz_id  = req.params.id;
            const {quiz_question_id,selected_option} = req.body;
            const user_id =  res.locals.user_id;
            if(!quiz_id){
                throw badRequest(speeches.QUIZ_ID_REQUIRED);
            }
            if(!quiz_question_id){
                throw badRequest(speeches.QUIZ_QUESTION_ID_REQUIRED);
            }

            if(!user_id){
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }

            const questionAnswered = await this.crudService.findOne(quiz_question,{where: {quiz_question_id:quiz_question_id}});
            if(questionAnswered instanceof Error){
                throw internal(questionAnswered.message)
            }
            if(!questionAnswered){
                throw invalid("Invalid Quiz question id")
            }


            const quizRes = await this.crudService.findOne(quiz_response,{where: {quiz_id:quiz_id,user_id:user_id}});
            if(quizRes instanceof Error){
                throw internal(quizRes.message)
            }          
            // console.log(quizRes);
            let dataToUpsert:any = {}
            dataToUpsert = {quiz_id:quiz_id,user_id:user_id,updated_by:user_id}

            let responseObjToAdd:any = {}
            responseObjToAdd = {
                ...req.body,
                question:questionAnswered.dataValues.question,
                correct_answer:questionAnswered.dataValues.correct_ans,
                level:questionAnswered.dataValues.level,
                question_no:questionAnswered.dataValues.question_no,
                is_correct:selected_option==questionAnswered.correct_ans
            }
            
            let user_response:any = {}
            if(quizRes){
                console.log(quizRes.dataValues.response);
                user_response = JSON.parse(quizRes.dataValues.response);
                user_response[questionAnswered.dataValues.question_no] = responseObjToAdd;

                dataToUpsert["response"]=JSON.stringify(user_response);
                
                const result =  await this.crudService.update(quizRes,dataToUpsert,{where:{quiz_id:quiz_id,user_id:user_id}})
                if(result instanceof Error){
                    throw internal(result.message)
                }
                
                res.status(200).send(dispatcher(result));
            }else{
                
                user_response[questionAnswered.dataValues.question_no]=responseObjToAdd;

                dataToUpsert["response"]=JSON.stringify(user_response);
                dataToUpsert = {...dataToUpsert,created_by:user_id}

                const result =  await this.crudService.create(quiz_response,dataToUpsert)
                if(result instanceof Error){
                    throw internal(result.message)
                }
                
                res.status(200).send(dispatcher(result));
            }
        }catch(err){
            next(err)
        }
    }
} 
