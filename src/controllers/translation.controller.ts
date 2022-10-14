import { Request,Response,NextFunction } from "express";
import TranslationService from "../services/translation.service";
import dispatcher from "../utils/dispatch.util";

import { courseModuleSchema, courseModuleUpdateSchema } from "../validations/courseModule.validationa";
import { translationSchema, translationUpdateSchema } from "../validations/translation.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";

export default class TranslationController extends BaseController {

    model = "translation";

    protected initializePath(): void {
        this.path = '/translations';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(translationSchema,translationUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.get(`${this.path}/refresh`, this.refreshTranslation.bind(this));
        super.initializeRoutes();
    }

    protected async refreshTranslation(req:Request,res:Response,next:NextFunction){
        try{
            const service = new TranslationService();
            await service.refreshDataFromDb();
            res.status(201).send(dispatcher(res,"data refrehsed succesfully", 'success'));
        }catch(err){
            next(err)
        }
    }
}