import validationMiddleware from "../middlewares/validation.middleware";
import CRUDController from "./crud.controller";
import ValidationsHolder from "../validations/validationHolder";
import { Router } from "express";


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

    protected initializeRoutes(aditionalrouts: any =null): void {
        this.router.get(`${this.path}`, this.getData);
        this.router.get(`${this.path}/:id`, this.getData);
        this.router.post(`${this.path}`, validationMiddleware(this.validations?.create),this.createData);
        this.router.put(`${this.path}/:id`,validationMiddleware(this.validations?.update), this.updateData);
        this.router.delete(`${this.path}/:id`, this.deleteData);

        // if(typeof aditionalrouts === "object" && aditionalrouts.length > 0){
        //     for (let route of aditionalrouts) {
        //         // this.router.use(route.path, route.validation ,route.router);
        //         let rout_str = "";
        //         if(!route.validation){
        //             rout_str = `this.router.${route.method}('${route.path}', this.${route.handler});`
        //         }else{
        //             rout_str = `this.router.${route.method}('${route.path}', validationMiddleware(this.validations?.${route.validation}),this.${route.handler});`
        //         }
        //         console.log(rout_str)
        //         eval(rout_str);
        //     }
        // }

        if(aditionalrouts){
            this.router.use(aditionalrouts);
        }
    }
}