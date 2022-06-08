import validationMiddleware from "../middlewares/validation.middleware";
import CRUDController from "./crud.controller";
import { courseSchema } from "../validations/course.validations";
import authValidations from "../validations/auth.validations";
import Joi, { any } from 'joi';
import ValidationsHolder from "../validations/ValidationsHolder";

export default class BaseController extends CRUDController {
    model:string="";
    validations?: ValidationsHolder;

    protected init(): void {
        this.initializeValidations();
        super.init()
    }

    protected initializeValidations(): void {
       this.validations =  new ValidationsHolder(null,null);
    }

    protected loadModel = async (model: string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${this.model}.model`);
        return modelClass[this.model];
    }

    protected initializeRoutes(): void {
        this.router.get(`${this.path}`, this.getData);
        this.router.get(`${this.path}/:id`, this.getData);
        this.router.post(`${this.path}`, validationMiddleware(this.validations?.create),this.createData);
        this.router.put(`${this.path}/:id`,validationMiddleware(this.validations?.update), this.updateData);
        this.router.delete(`${this.path}/:id`, this.deleteData);
    }
}