import validationMiddleware from "../middlewares/validation.middleware";
import CRUDController from "./crud.controller";
import { courseSchema } from "../validations/course.validations";
import authValidations from "../validations/auth.validations";
import Joi, { any } from 'joi';

export default class BaseController extends CRUDController {
    model:string="";
    middlewares = [validationMiddleware(courseSchema),validationMiddleware(authValidations.login) ]
    protected loadModel = async (model: string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${this.model}.model`);
        return modelClass[this.model];
    }

    protected getValidationSchema ():Joi.Schema {
        return authValidations.login;
    }

    protected initializeRoutes(): void {
        this.router.get(`${this.path}`, this.getData);
        this.router.get(`${this.path}/:id`, this.getData);
        this.router.post(`${this.path}`, validationMiddleware(this.getValidationSchema()),this.createData);
        this.router.put(`${this.path}/:id`,validationMiddleware(this.getValidationSchema()), this.updateData);
        this.router.delete(`${this.path}/:id`, this.deleteData);
    }
}