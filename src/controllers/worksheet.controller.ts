
import { worksheetSchema, worksheetUpdateSchema } from "../validations/worksheet.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import { NextFunction, Request, Response } from "express";
import { badRequest } from "boom";
import { speeches } from "../configs/speeches.config";
import path from "path";
import fs from 'fs';
import dispatcher from "../utils/dispatch.util";
export default class WorksheetController extends BaseController {

    model = "worksheet";

    protected initializePath(): void {
        this.path = '/worksheets';
    }
    protected initializeValidations(): void {
        this.validations =  new ValidationsHolder(worksheetSchema,worksheetUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.post(this.path+"/:id/response", this.submitResponse.bind(this));

        super.initializeRoutes();
    }

    protected async submitResponse(req:Request,res:Response,next:NextFunction):Promise<Response | void>{
        const worksheet_id =  req.params.id;
        if(!worksheet_id){
            throw badRequest(speeches.WORKSHEET_ID_REQUIRED);
        }

        const rawfiles: any = req.files;
        const files: any = Object.values(rawfiles);
        const file_key: any = Object.keys(rawfiles);
        console.log(file_key);
        const reqData: any = req.body;
        const errs: any = [];
        let attachments = "";
        for (const file_name of Object.keys(files)) {
            const file = files[file_name];
            console.log(file);
            let filename = file.path.split(path.sep).pop();
            filename = ""+Date.now()+"_"+filename
            const targetPath = path.join(process.cwd(), 'resources', 'static', 'uploads', 'worksheets' ,'responses', filename);
            await fs.rename(file.path, targetPath, async (err) => {
                if (err) {
                    errs.push(`Error uploading file: ${file.originalFilename}`);
                } else {
                    reqData[file.fieldName] = `/worksheets/responses/${filename}`;
                    attachments  = attachments+`/worksheets/responses/${filename},`
                    //todo: add this fieldname to an comma separarted variable called atttachments
                }
            });
        }
        if (errs.length) {
            return res.status(406).send(dispatcher(errs, 'error', speeches.NOT_ACCEPTABLE, 406));
        }

        //todo: prepare object with attachment variable to be put into the worksheet response db 
        const modelLoaded = await this.loadModel("worksheet_response");
        
        let dataToBeUploaded:any = {};
        dataToBeUploaded["worksheet_id"]= worksheet_id
        dataToBeUploaded["attachments"]= attachments
        const payload = this.autoFillTrackingCollumns(req, res, modelLoaded, dataToBeUploaded)
        const data = await this.crudService.create(modelLoaded, payload);
    }
} 
