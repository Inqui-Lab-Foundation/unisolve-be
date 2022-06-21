import { notFound } from "boom";
import { NextFunction, Request, Response } from "express";
import dispatcher from "../utils/dispatch.util";
import Joi from "joi";

import BaseController from "./base.controller";
import ValidationsHolder from "../validations/validationHolder";
import { courseSchema, courseUpdateSchema } from "../validations/course.validations";
import { where } from "sequelize/types";
import { course_module } from "../models/course_module.model";
import { course_topic } from "../models/course_topic.model";
export default class CourseController extends BaseController {
    model = "course";

    protected initializePath(): void {
        this.path = '/course';
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
       let modelClassCourseModule = await this.loadModel("course_module");
       let modelClassTopic = await this.loadModel("course_topic");
       let modelClassVideo = await this.loadModel("course_video");
       let dataToReturn: any = {};

       whereClause[`${this.model}_id`] = req.params.id;
       
       let data = await this.crudService.findOne(modelClass, { where: whereClause ,include: [{model:course_module,include:[{model:course_topic}]}]});
        //  if (data) {
        //     dataToReturn = data.dataValues;
        //     whereClause = {}
        //     whereClause[`course_id`] = data.course_id;
        //     console.log("whereClause====================",whereClause);
        //     const courseModules = await this.crudService.findWhere(modelClassCourseModule, whereClause );
        //     dataToReturn.courseModules = courseModules;       
        //     console.log("data====================",dataToReturn);
                   

        //  }
         return data;
    }

    //TODO: add logic to below overriden method to save thumbnail image as well 
    protected createData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model } = req.params;
            const data = await this.crudService.create(await this.loadModel(model), req.body);
            if (!data) {
                return res.status(404).send(dispatcher(data, 'error'));
            }
            return res.status(200).send(data);
        } catch (error) {
            next(error);
        }
    }



    //TODO: add logic to below overriden method to save thumbnail image as well 
    protected updateData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model, id } = req.params;
            const data = await this.crudService.update(await this.loadModel(model), req.body, { where: { id } });
            if (!data) {
                return res.status(404).send(dispatcher(data, 'error'));
            }
            return res.status(200).send(data);
        } catch (error) {
            next(error);
        }
    }

}