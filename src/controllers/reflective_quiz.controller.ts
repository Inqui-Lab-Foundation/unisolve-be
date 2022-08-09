

import { badRequest, internal, notFound, unauthorized } from "boom";
import { NextFunction, Request, Response } from "express";
import { invalid } from "joi";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import validationMiddleware from "../middlewares/validation.middleware";
import { course_topic } from "../models/course_topic.model";
import { quiz_question } from "../models/quiz_question.model";
import { quiz_response } from "../models/quiz_response.model";
import { quiz_survey_question } from "../models/quiz_survey_question.model";
import { reflective_quiz_question } from "../models/reflective_quiz_question.model";
import { reflective_quiz_response } from "../models/reflective_quiz_response.model";
import { user_topic_progress } from "../models/user_topic_progress.model";
import ReflectiveQuizService from "../services/reflective_quiz_.service";
import dispatcher from "../utils/dispatch.util";
import { quizNextQuestionSchema, quizSchema, quizSubmitResponseSchema, quizUpdateSchema } from "../validations/reflective_quiz.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class ReflectiveQuizController extends BaseController {
    reflectiveQuizService:ReflectiveQuizService = new ReflectiveQuizService
    model = "reflective_quiz_question";

    protected initializePath(): void {
        this.path = '/reflectiveQuiz';
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

    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            
            let data: any;
            const { model, id } = req.params;
            const paramStatus: any = req.query.status;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size, title } = req.query;
            let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            let whereClauseStatusPart: any = {};
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
            }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, {
                    where: {
                        [Op.and]: [
                            whereClauseStatusPart,
                            where,
                        ]
                    },
                    include:{
                        model:quiz_survey_question,
                    }                  
                });
            } else {
                try {
                    const responseOfFindAndCountAll = await this.crudService.findAll(modelClass, {
                        where: {
                            [Op.and]: [
                                whereClauseStatusPart,
                                condition
                            ]
                        },
                        include:{
                            model:quiz_survey_question,
                        },limit, offset
                    })
                    const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    data = result;
                } catch (error: any) {
                    return res.status(500).send(dispatcher(data, 'error'))
                }

            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                if (data != null) {
                    throw notFound(data.message)
                } else {
                    throw notFound()
                }
                res.status(200).send(dispatcher(null,"error",speeches.DATA_NOT_FOUND));
                // if(data!=null){
                //     throw 
                (data.message)
                // }else{
                //     throw notFound()
                // }
            }

            return res.status(200).send(dispatcher(data, 'success'));
        } catch (error) {
            next(error);
        }
    }

    protected async  getNextQuestion(req:Request,res:Response,next:NextFunction): Promise<Response | void> {
        try{
            const  video_id  = req.params.id;
            const  paramStatus :any = req.query.status;
            const user_id =  res.locals.user_id;
            
            const nextQuestionsToChooseFrom:any = await this.reflectiveQuizService.fetchNextQuestion(user_id,video_id,paramStatus)
            if(nextQuestionsToChooseFrom instanceof Error){
                throw nextQuestionsToChooseFrom;
            }
            if(nextQuestionsToChooseFrom){
                let resultQuestion:any = {}
                let optionsArr = []
                if(nextQuestionsToChooseFrom.dataValues.option_a){
                    optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_a)
                }
                if(nextQuestionsToChooseFrom.dataValues.option_b){
                    optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_b)
                }
                if(nextQuestionsToChooseFrom.dataValues.option_c){
                    optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_c)
                }
                if(nextQuestionsToChooseFrom.dataValues.option_d){
                    optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_d)
                }
                
                
                resultQuestion["quiz_id"] = nextQuestionsToChooseFrom.dataValues.quiz_id;
                resultQuestion["reflective_quiz_question_id"] = nextQuestionsToChooseFrom.dataValues.reflective_quiz_question_id;
                resultQuestion["question_no"] = nextQuestionsToChooseFrom.dataValues.question_no;
                resultQuestion["question"] = nextQuestionsToChooseFrom.dataValues.question;
                resultQuestion["question_image"] = nextQuestionsToChooseFrom.dataValues.question_image;
                resultQuestion["options"] = optionsArr;
                resultQuestion["level"] = nextQuestionsToChooseFrom.dataValues.level;
                resultQuestion["type"] = nextQuestionsToChooseFrom.dataValues.type;

                res.status(200).send(dispatcher(resultQuestion))
            }else{
                //update worksheet topic progress for this user to completed..!!
                // if(!boolStatusWhereClauseRequired || 
                //     (boolStatusWhereClauseRequired && paramStatus == "ACTIVE")){
                //     const updateProgress =  await this.crudService.create(user_topic_progress,{"user_id":user_id,"course_topic_id":curr_topic.course_topic_id,"status":"COMPLETED"})
                // }
                
                //send response that quiz is completed..!!
                res.status(200).send(dispatcher("Quiz has been completed no more questions to display"))
            }
        }catch(err){
            next(err)
        }
    }


    

    protected async submitResponse(req:Request,res:Response,next:NextFunction) {
        try{
            
            const  video_id  = req.params.id;
            const {reflective_quiz_question_id,selected_option} = req.body;
            const user_id =  res.locals.user_id;
            if(!video_id){
                throw badRequest(speeches.QUIZ_ID_REQUIRED);
            }
            if(!reflective_quiz_question_id){
                throw badRequest(speeches.QUIZ_QUESTION_ID_REQUIRED);
            }

            if(!user_id){
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }

            const questionAnswered = await this.crudService.findOne(reflective_quiz_question,{where: {reflective_quiz_question_id:reflective_quiz_question_id}});
            if(questionAnswered instanceof Error){
                throw internal(questionAnswered.message)
            }
            if(!questionAnswered){
                throw invalid("Invalid Quiz question id")
            }


            const quizRes = await this.crudService.findOne(reflective_quiz_response,{where: {video_id:video_id,user_id:user_id}});
            if(quizRes instanceof Error){
                throw internal(quizRes.message)
            }          
            // console.log(quizRes);
            let dataToUpsert:any = {}
            dataToUpsert = {video_id:video_id,user_id:user_id,updated_by:user_id}
            
            //copy all attachments....
            const attachmentsCopyResult = await this.copyAllFiles(req,null,"reflective_quiz","responses");
            if (attachmentsCopyResult.errors.length>0) {
                return res.status(406).send(dispatcher(attachmentsCopyResult.errors, 'error', speeches.NOT_ACCEPTABLE, 406));
            }

            let responseObjToAdd:any = {}
            responseObjToAdd = {
                ...req.body,
                question:questionAnswered.dataValues.question,
                correct_answer:questionAnswered.dataValues.correct_ans,
                level:questionAnswered.dataValues.level,
                question_no:questionAnswered.dataValues.question_no,
                attachments:attachmentsCopyResult.attachments,
                is_correct:selected_option==questionAnswered.correct_ans,      
            }
            
            let user_response:any = {}
            if(quizRes){
                // console.log(quizRes.dataValues.response);
                user_response = JSON.parse(quizRes.dataValues.response);
                user_response[questionAnswered.dataValues.question_no] = responseObjToAdd;

                dataToUpsert["response"]=JSON.stringify(user_response);
                
                const resultModel =  await this.crudService.update(quizRes,dataToUpsert,{where:{video_id:video_id,user_id:user_id}})
                if(resultModel instanceof Error){
                    throw internal(resultModel.message)
                }
                let result:any = {}
                result = resultModel.dataValues
                result["is_correct"] = responseObjToAdd.is_correct;
                if(responseObjToAdd.is_correct){
                    result["msg"] = questionAnswered.dataValues.msg_ans_correct;
                }else{
                    result["msg"] = questionAnswered.dataValues.msg_ans_wrong;
                }
                result["redirect_to"] = questionAnswered.dataValues.redirect_to;
                res.status(200).send(dispatcher(result));
            }else{
                
                user_response[questionAnswered.dataValues.question_no]=responseObjToAdd;

                dataToUpsert["response"]=JSON.stringify(user_response);
                dataToUpsert = {...dataToUpsert,created_by:user_id}

                const resultModel =  await this.crudService.create(reflective_quiz_response,dataToUpsert)
                if(resultModel instanceof Error){
                    throw internal(resultModel.message)
                }
                let result:any = {}
                result = resultModel.dataValues
                result["is_correct"] = responseObjToAdd.is_correct;
                if(responseObjToAdd.is_correct){
                    result["msg"] = questionAnswered.dataValues.msg_ans_correct;
                }else{
                    result["msg"] = questionAnswered.dataValues.msg_ans_wrong;
                }
                result["redirect_to"] = questionAnswered.dataValues.redirect_to;
                res.status(200).send(dispatcher(result));
            }
        }catch(err){
            console.log(err)
            next(err)
        }
    }
} 
