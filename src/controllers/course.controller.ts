import { notFound } from "boom";
import { NextFunction, Request, Response } from "express";
import dispatcher from "../utils/dispatch.util";
import Joi from "joi";
import { courseSchema, courseUpdateSchema } from "../validations/course.validations";
import ValidationsHolder from "../validations/ValidationsHolder";
import BaseController from "./base.controller";
export default class CourseController extends BaseController {
    model = "course";
    validations: ValidationsHolder | undefined;

    protected initializePath(): void {
        this.path = '/course';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(courseSchema,courseUpdateSchema);
    }

    protected initializeRoutes(): void {
        super.initializeRoutes();
        
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
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