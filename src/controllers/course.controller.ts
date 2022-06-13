import { notFound } from "boom";
import { NextFunction, Request, Response } from "express";
import dispatcher from "../utils/dispatch.util";
import Joi from "joi";

import BaseController from "./base.controller";
import ValidationsHolder from "../validations/validationHolder";
import { courseSchema, courseUpdateSchema } from "../validations/course.validations";
export default class CourseController extends BaseController {
    model = "course";

    protected initializePath(): void {
        this.path = '/course';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(courseSchema,courseUpdateSchema);
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