import { badData, badRequest, internal, unauthorized } from "boom";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import validationMiddleware from "../middlewares/validation.middleware";
import { challenge_question } from "../models/challenge_questions.model";
import { challenge_response } from "../models/challenge_response.model";
import dispatcher from "../utils/dispatch.util";
import {quizSchema, quizSubmitResponseSchema, quizUpdateSchema } from "../validations/quiz.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class QuizController extends BaseController {

    model = "challenge";

    protected initializePath(): void {
        this.path = '/challenge';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(quizSchema, quizUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.get(this.path + "/:id/nextQuestion/", this.getNextQuestion.bind(this));
        this.router.post(this.path + "/:id/response/", validationMiddleware(quizSubmitResponseSchema), this.submitResponse.bind(this));
        // this.router.post(this.path + "/:id/responses/", validationMiddleware(quizSubmitResponsesSchema), this.submitResponses.bind(this));
        super.initializeRoutes();
    }

    protected async getNextQuestion(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { challenge_id, team_id } = req.params
        const paramStatus: any = req.query.status;
        //checking for challenge_id and team_id
        if (!challenge_id) {
            throw badRequest(speeches.CHALLENGE_ID_REQUIRED);
        }
        if (!team_id) {
            throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
        }
        //check if the given challenge is a valid topic
        // const curr_topic = await this.crudService.findOne(course_topic, { where: { "topic_type_id": quiz_id, "topic_type": "QUIZ" } })
        // if (!curr_topic || curr_topic instanceof Error) {
        //     throw badRequest("INVALID TOPIC");
        // }
        //
        const challengeRes = await this.crudService.findOne(challenge_response, { where: { challenge_id, team_id } });
        if (challengeRes instanceof Error) throw internal(challengeRes.message);
        let whereClauseStatusPart: any = {}
        let boolStatusWhereClauseRequired = false
        if (paramStatus && (paramStatus in constents.challenges_flags.list)) {
            whereClauseStatusPart = { "status": paramStatus }
            boolStatusWhereClauseRequired = true;
        }
        let question_no = 1
        let nextQuestion: any = null;
        if (challengeRes) {
            //TODO: implement checking response and based on that change the 
            let user_response: any = {}
            user_response = JSON.parse(challengeRes.dataValues.response);
            let questionNosAnsweredArray = Object.keys(user_response);
            questionNosAnsweredArray = questionNosAnsweredArray.sort((a, b) => (a > b ? -1 : 1));
            const noOfQuestionsAnswered = Object.keys(user_response).length
            const lastQuestionAnswered = user_response[questionNosAnsweredArray[0]] //we have assumed that this length will always have at least 1 item ; this could potentially be a source of bug, but is not since this should always be true based on above checks ..
            if (lastQuestionAnswered.selected_option == lastQuestionAnswered.correct_answer) {
                question_no = lastQuestionAnswered.question_no + 1;
            } else {
                question_no = lastQuestionAnswered.question_no;
                // if (lastQuestionAnswered.level == "HARD") {
                //     level = "MEDIUM"
                // } else if (lastQuestionAnswered.level == "MEDIUM") {
                //     level = "EASY"
                // } else if (lastQuestionAnswered.level == "EASY") {
                //     question_no = lastQuestionAnswered.question_no + 1;
                //     level = "HARD"
                // }
            }
        }
        const nextQuestionsToChooseFrom = await this.crudService.findOne(challenge_question, {
            where: {
                [Op.and]: [
                    whereClauseStatusPart,
                    { quiz_id: challenge_id },
                    // { level: level },
                    { question_no: question_no },
                ]

            }
        })
        if (nextQuestionsToChooseFrom instanceof Error) {
            throw internal(nextQuestionsToChooseFrom.message)
        }
        if (nextQuestionsToChooseFrom) {
            let resultQuestion: any = {}
            let optionsArr = []
            if (nextQuestionsToChooseFrom.dataValues.option_a) {
                optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_a)
            }
            if (nextQuestionsToChooseFrom.dataValues.option_b) {
                optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_b)
            }
            if (nextQuestionsToChooseFrom.dataValues.option_c) {
                optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_c)
            }
            if (nextQuestionsToChooseFrom.dataValues.option_d) {
                optionsArr.push(nextQuestionsToChooseFrom.dataValues.option_d)
            }
            // resultQuestion["quiz_id"] = nextQuestionsToChooseFrom.dataValues.quiz_id;
            // resultQuestion["quiz_question_id"] = nextQuestionsToChooseFrom.dataValues.quiz_question_id;
            // resultQuestion["question_no"] = nextQuestionsToChooseFrom.dataValues.question_no;
            // resultQuestion["question"] = nextQuestionsToChooseFrom.dataValues.question;
            // resultQuestion["question_image"] = nextQuestionsToChooseFrom.dataValues.question_image;
            // resultQuestion["question_icon"] = nextQuestionsToChooseFrom.dataValues.question_icon;
            // resultQuestion["options"] = optionsArr;
            // resultQuestion["level"] = nextQuestionsToChooseFrom.dataValues.level;
            // resultQuestion["type"] = nextQuestionsToChooseFrom.dataValues.type;
            res.status(200).send(dispatcher(resultQuestion))
        } else {
            //update worksheet topic progress for this user to completed..!!
            // if (!boolStatusWhereClauseRequired ||
            //     (boolStatusWhereClauseRequired && paramStatus == "ACTIVE")) {
            //     const updateProgress = await this.crudService.create(user_topic_progress, { "user_id": user_id, "course_topic_id": curr_topic.course_topic_id, "status": "COMPLETED" })
            // }
            //send response that quiz is completed..!!
            res.status(200).send(dispatcher("Quiz has been completed no more questions to display"))
        }
    }

    protected async submitResponse(req: Request, res: Response, next: NextFunction) {
        try {

            const challenge_id = req.params.id;
            const { challenge_question_id, selected_option, team_id } = req.body;
            const user_id = res.locals.user_id;
            if (!challenge_id) {
                throw badRequest(speeches.CHALLENGE_ID_REQUIRED);
            }
            if (!challenge_question_id) {
                throw badRequest(speeches.CHALLENGE_QUESTION_ID_REQUIRED);
            }
            if (!user_id) {
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }
            const questionAnswered = await this.crudService.findOne(challenge_question, { where: { challenge_question_id } });
            if (questionAnswered instanceof Error) {
                throw internal(questionAnswered.message)
            }
            if (!questionAnswered) {
                throw badData("Invalid Quiz question id")
            }

            // let topic_to_redirect_to = null;
            // if (questionAnswered.dataValues.redirect_to) {
            //     topic_to_redirect_to = await this.crudService.findOne(course_topic, {
            //         where: {
            //             course_topic_id: questionAnswered.dataValues.redirect_to
            //         },
            //         include: [{
            //             model: video,
            //             as: 'video',
            //             required: false
            //         }]
            //     })
            // }
            // if (topic_to_redirect_to instanceof Error) {
            //     console.log(topic_to_redirect_to);
            //     topic_to_redirect_to = null
            // }
            const challengeRes = await this.crudService.findOne(challenge_response, { where: { challenge_id, team_id } });
            if (challengeRes instanceof Error) {
                throw internal(challengeRes.message)
            }
            // console.log(quizRes);
            let dataToUpsert: any = {}
            dataToUpsert = { challenge_id, team_id, updated_by: user_id }

            //check if question was answered correctly
            let hasQuestionBeenAnsweredCorrectly = false;
            if (questionAnswered.type == "MRQ" || questionAnswered.type == "MCQ") {
                hasQuestionBeenAnsweredCorrectly = true;
            }
            // else if (!questionAnswered.correct_ans || questionAnswered.correct_ans == "(())" || questionAnswered.correct_ans == "") {
            //     hasQuestionBeenAnsweredCorrectly = true;
            // }
            else {
                hasQuestionBeenAnsweredCorrectly = selected_option == questionAnswered.correct_ans
            }

            let responseObjToAdd: any = {}
            responseObjToAdd = {
                ...req.body,
                question: questionAnswered.dataValues.question,
                correct_answer: questionAnswered.dataValues.correct_ans,
                // level: questionAnswered.dataValues.level,
                question_no: questionAnswered.dataValues.question_no,
                is_correct: hasQuestionBeenAnsweredCorrectly
            }

            let user_response: any = {}
            if (challengeRes) {
                user_response = JSON.parse(challengeRes.dataValues.response);
                user_response[questionAnswered.dataValues.question_no] = responseObjToAdd;

                dataToUpsert["response"] = JSON.stringify(user_response);

                const resultModel = await this.crudService.update(challengeRes, dataToUpsert, { where: { challenge_id, team_id } })
                if (resultModel instanceof Error) {
                    throw internal(resultModel.message)
                }
                let result: any = {}
                result = resultModel.dataValues
                // result["is_correct"] = responseObjToAdd.is_correct;
                // if (responseObjToAdd.is_correct) {
                //     result["msg"] = questionAnswered.dataValues.msg_ans_correct;
                //     result["ar_image"] = questionAnswered.dataValues.ar_image_ans_correct;
                //     result["ar_video"] = questionAnswered.dataValues.ar_video_ans_correct;
                //     result["accimg"] = questionAnswered.dataValues.accimg_ans_correct;
                // } else {
                //     result["msg"] = questionAnswered.dataValues.msg_ans_wrong;
                //     result["ar_image"] = questionAnswered.dataValues.ar_image_ans_wrong;
                //     // result["ar_video"]= questionAnswered.dataValues.ar_video_ans_wrong;
                //     result["ar_video"] = topic_to_redirect_to
                //     result["accimg"] = questionAnswered.dataValues.accimg_ans_wrong;
                // }
                // result["redirect_to"] = topic_to_redirect_to;
                res.status(200).send(dispatcher(result));
            } else {

                user_response[questionAnswered.dataValues.question_no] = responseObjToAdd;

                dataToUpsert["response"] = JSON.stringify(user_response);
                dataToUpsert = { ...dataToUpsert, created_by: user_id }

                const resultModel = await this.crudService.create(challenge_response, dataToUpsert)
                if (resultModel instanceof Error) {
                    throw internal(resultModel.message)
                }
                let result: any = {}
                result = resultModel.dataValues
                // result["is_correct"] = responseObjToAdd.is_correct;
                // if (responseObjToAdd.is_correct) {
                //     result["msg"] = questionAnswered.dataValues.msg_ans_correct;
                //     result["ar_image"] = questionAnswered.dataValues.ar_image_ans_correct;
                //     result["ar_video"] = questionAnswered.dataValues.ar_video_ans_correct;
                //     result["accimg"] = questionAnswered.dataValues.accimg_ans_correct;
                // } else {
                //     result["msg"] = questionAnswered.dataValues.msg_ans_wrong;
                //     result["ar_image"] = questionAnswered.dataValues.ar_image_ans_wrong;
                //     // result["ar_video"]= questionAnswered.dataValues.ar_video_ans_wrong;
                //     result["ar_video"] = topic_to_redirect_to
                //     result["accimg"] = questionAnswered.dataValues.accimg_ans_wrong;
                // }
                // result["redirect_to"] = topic_to_redirect_to;
                res.status(200).send(dispatcher(result));
            }
        } catch (err) {
            next(err)
        }
    }
    //TODO: 
}