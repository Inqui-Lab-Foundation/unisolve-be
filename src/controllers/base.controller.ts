import validationMiddleware from "../middlewares/validation.middleware";
import CRUDController from "./crud.controller";
import ValidationsHolder from "../validations/validationHolder";
import { NextFunction, Request, Response } from "express";
import dispatcher from "../utils/dispatch.util";


export default class BaseController extends CRUDController {
    validations?: ValidationsHolder;

    protected init(): void {
        this.initializeValidations();
        super.init()
    }

    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(null, null);
    }

    protected loadModel = async (model: string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${this.model}.model`);
        return modelClass[this.model];
    }

    protected initializeRoutes(aditionalrouts: any = null): void {
        this.router.get(`${this.path}`, this.getData);
        this.router.get(`${this.path}/:id`, this.getData);
        this.router.post(`${this.path}`, validationMiddleware(this.validations?.create), this.createData);
        this.router.put(`${this.path}/:id`, validationMiddleware(this.validations?.update), this.updateData);
        this.router.delete(`${this.path}/:id`, this.deleteData);
        if (aditionalrouts) {
            this.router.use(aditionalrouts);
        }
    }
}