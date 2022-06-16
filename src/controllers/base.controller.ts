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

    protected async loadModel (model: string): Promise<Response | void | any> {
        let modelToFetch = model;
        if(!modelToFetch){
            modelToFetch = this.model;
        }
        const modelClass = await import(`../models/${modelToFetch}.model`);
        return modelClass[modelToFetch];
    }

    protected initializeRoutes(aditionalrouts: any = null): void {
        this.router.get(`${this.path}`, this.getData.bind(this));
        this.router.get(`${this.path}/:id`, this.getData.bind(this));
        this.router.post(`${this.path}`, validationMiddleware(this.validations?.create), this.createData.bind(this));
        this.router.put(`${this.path}/:id`, validationMiddleware(this.validations?.update), this.updateData.bind(this));
        this.router.delete(`${this.path}/:id`, this.deleteData.bind(this));
        if (aditionalrouts) {
            this.router.use(aditionalrouts);
        }
    }

}