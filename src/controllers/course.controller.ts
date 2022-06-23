import { notFound, unauthorized } from "boom";
import { NextFunction, Request, Response } from "express";
import dispatcher from "../utils/dispatch.util";
import Joi from "joi";

import BaseController from "./base.controller";
import ValidationsHolder from "../validations/validationHolder";
import { courseSchema, courseUpdateSchema } from "../validations/course.validations";
import { where } from "sequelize/types";
import { course_module } from "../models/course_module.model";
import { course_topic } from "../models/course_topic.model";
import { user_ctopic_progress } from "../models/user_ctopic_progress.model";
import { Op } from "sequelize";
import db from "../utils/dbconnection.util"
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
export default class CourseController extends BaseController {
    model = "course";

    protected initializePath(): void {
        this.path = '/courses';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(courseSchema, courseUpdateSchema);
    }

    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        this.router.get(`${this.path}/test`, this.testRoute);
        super.initializeRoutes();

    }
    protected testRoute(req: Request, res: Response, next: NextFunction) {
        // console.log("came here");
        return res.status(200).json(dispatcher("this was a success ....!!!"));
    }


    protected async getData  (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const modelClass = await this.loadModel(model)
            const where: any = {};
            if (id) {
                // where[`${this.model}_id`] = req.params.id;
                data =  await this.getDetailsData(req,res,modelClass)
            } else {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findAll(modelClass);
            }

            if (!data) {
                return res.status(404).send(dispatcher(data, 'error'));
            }
            return res.status(200).send(dispatcher(data, 'success'));
        } catch (error) {
            next(error);
        }
    }
    
   async  getDetailsData(req: Request, res: Response,modelClass: any) {
       let whereClause: any = {};

       whereClause[`${this.model}_id`] = req.params.id;
       let user_id =  res.locals.user_id;
       if(!user_id){
        throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
       }
       let data = await this.crudService.findOne(modelClass, { 
            where: whereClause ,
            include: [{
                model:course_module,
                as:'course_modules',
                include:[{
                    model:course_topic,
                    as :"course_topics",
                    attributes:[ 
                        "title",
                        "course_module_id",
                        "course_topic_id",
                        "topic_type_id",
                        "topic_type",
                        [
                            // Note the wrapping parentheses in the call below!
                            db.literal(`(
                                SELECT CASE WHEN EXISTS 
                                    (SELECT status 
                                    FROM user_ctopic_progress as p 
                                    WHERE p.user_id = ${user_id} 
                                    AND p.course_topic_id = \`course_modules->course_topics\`.\`course_topic_id\`) 
                                THEN  
                                    (SELECT case p.status when NULL then "INCOMPLETE" ELSE p.status END AS progress 
                                    FROM user_ctopic_progress AS p
                                    WHERE p.course_topic_id = \`course_modules->course_topics\`.\`course_topic_id\`
                                    AND p.user_id = ${user_id}
                                    ORDER BY p.updated_at DESC
                                    LIMIT 1)
                                ELSE 
                                    '${constents.task_status_flags.default}'
                                END as progress
                            )`),
                            'progress'
                        ]
                    ],
                }]}
            ]
        });
         return data;
    }

}