import { notFound } from "boom";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { reflective_quiz_question } from "../models/reflective_quiz_question.model";
import dispatcher from "../utils/dispatch.util";
import ValidationsHolder from "../validations/validationHolder";
import { videoSchema, videoUpdateSchema } from "../validations/video.validations";
import BaseController from "./base.controller";

export default class VideoController extends BaseController {

    model = "video";

    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(videoSchema,videoUpdateSchema);
    }
    protected initializePath(): void {
        this.path = '/videos';
    }
    
    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        super.initializeRoutes();
    }

    protected async getData(req:Request, res: Response, next: NextFunction) {
        // super.getData(req,res,next)
        try {
            let data: any;
            const { model, id} = req.params;
            const paramStatus:any = req.query.status;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size, title } = req.query;
            let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error=>{
                next(error)
            });
            const where: any = {};
            let whereClauseStatusPart:any = {};
            if(paramStatus && (paramStatus in constents.common_status_flags.list)){
                whereClauseStatusPart = {"status":paramStatus}
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
                        required:false,
                        model:reflective_quiz_question,
                        where:{
                            [Op.and]:[
                                whereClauseStatusPart
                            ]
                        },
                    },
                });
                data = this.formatOneRowProperly(data)
            } else {
                try{
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                            where: {
                                [Op.and]: [
                                    whereClauseStatusPart,
                                    condition
                                ]
                            },
                            include:{
                                required:false,
                                model:reflective_quiz_question,
                                where:{
                                    [Op.and]:[
                                        whereClauseStatusPart
                                    ]
                                },
                            },
                            limit,
                            offset 
                        })
                    let result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    
                    result  = this.formatAllRowsProperly(result);
                    // console.log(result)
                    data = result;
                } catch(error:any){
                    return res.status(500).send(dispatcher(data, 'error'))
                }
                
            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                if(data!=null){
                    throw notFound(data.message)
                }else{
                    throw notFound()
                }
            }

            return res.status(200).send(dispatcher(data, 'success'));
        } catch (error) {
            next(error);
        }
    }
    protected formatOneRowProperly(data:any):any{
        let dataModified = JSON.parse(JSON.stringify(data));
        const newVideoRow =   dataModified
                
        const newQuestionsFomratted =  dataModified.reflective_quiz_questions.map((questionRaw:any)=>{
            
            let resultQuestion:any = {}
            let optionsArr = []
            if(questionRaw.option_a){
                optionsArr.push(questionRaw.option_a)
            }
            if(questionRaw.option_b){
                optionsArr.push(questionRaw.option_b)
            }
            if(questionRaw.option_c){
                optionsArr.push(questionRaw.option_c)
            }
            if(questionRaw.option_d){
                optionsArr.push(questionRaw.option_d)
            }
            resultQuestion["video_id"] = questionRaw.video_id;
            resultQuestion["reflective_quiz_question_id"] = questionRaw.reflective_quiz_question_id;
            resultQuestion["question_no"] = questionRaw.question_no;
            resultQuestion["question"] = questionRaw.question;
            resultQuestion["question_image"] = questionRaw.question_image;
            resultQuestion["options"] = optionsArr;
            resultQuestion["level"] = questionRaw.level;
            resultQuestion["type"] = questionRaw.type;
            return resultQuestion;
        })
        
        newVideoRow.reflective_quiz_questions =  newQuestionsFomratted
        return newVideoRow;
    }
    protected formatAllRowsProperly(data:any):any{
        let result:any={}
        let dataModified = JSON.parse(JSON.stringify(data));

        result = dataModified.dataValues.map((videoRow:any)=>{
                return this.formatOneRowProperly(videoRow)
            })
        return result;
    }

}