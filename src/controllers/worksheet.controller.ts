
import { worksheetSchema, worksheetUpdateSchema } from "../validations/worksheet.validations";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import { NextFunction, Request, Response } from "express";
import { badRequest, internal, unauthorized } from "boom";
import { speeches } from "../configs/speeches.config";
import path from "path";
import fs from 'fs';
import dispatcher from "../utils/dispatch.util";
import { user_topic_progress } from "../models/user_topic_progress.model";
import { course_topic } from "../models/course_topic.model";
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

    protected async submitResponse(req:Request,res:Response,next:NextFunction){
        try{
            const worksheet_id =  req.params.id;
            if(!worksheet_id){
                throw badRequest(speeches.WORKSHEET_ID_REQUIRED);
            }
            const user_id =  res.locals.user_id;
            if(!user_id){
                throw unauthorized(speeches.UNAUTHORIZED_ACCESS);
            }

            //check if the given worksheet is a valid topic
            const curr_workshet_topic =  await this.crudService.findOne(course_topic,{where:{"topic_type_id":worksheet_id,"topic_type":"WORKSHEET"}})
            if(!curr_workshet_topic || curr_workshet_topic instanceof Error){
                throw badRequest("INVALID TOPIC");
            }

            //copy attached file in assets/worksheets/responses and add its path in attachment variable
            const rawfiles: any = req.files;
            const files: any = Object.values(rawfiles);
            const file_key: any = Object.keys(rawfiles);
            const reqData: any = req.body;
            const errs: any = [];
            let attachments = "";
            for (const file_name of Object.keys(files)) {
                const file = files[file_name];
                let filename = file.path.split(path.sep).pop();
                // filename = ""+Date.now()+"_"+filename
                filename = "user_id_"+user_id+"_worksheet_id_"+worksheet_id+"_"+filename
                const targetPath = path.join(process.cwd(), 'resources', 'static', 'uploads', 'worksheets' ,'responses', filename);
                const copyResult:any = await fs.promises.copyFile(file.path, targetPath).catch(err=>{
                    errs.push(`Error uploading file: ${file.originalFilename}`);
                })
                if(copyResult instanceof Error) {
                        errs.push(`Error uploading file: ${file.originalFilename}`);
                        // console.log(copyResult)
                        // throw internal(`Error uploading file: ${file.originalFilename}`) 
                        // next(internal(`Error uploading file: ${file.originalFilename}`))  
                } else {
                        
                    reqData[file.fieldName] = `/assets/worksheets/responses/${filename}`;
                    attachments  = attachments+`/assets/worksheets/responses/${filename},`
                    // console.log(attachments)
                }
            }
            if (errs.length) {
                return res.status(406).send(dispatcher(errs, 'error', speeches.NOT_ACCEPTABLE, 406));
            }

            const modelLoaded = await this.loadModel("worksheet_response");
            //create an entry in worksheet submission table
            let dataToBeUploaded:any = {};
            dataToBeUploaded["worksheet_id"]= worksheet_id
            dataToBeUploaded["user_id"] = user_id
            dataToBeUploaded["attachments"]= attachments
            const payload = this.autoFillTrackingCollumns(req, res, modelLoaded, dataToBeUploaded)
            const data = await this.crudService.create(modelLoaded, payload);

            //update worksheet topic progress for this user to completed..!!
            const updateProgress =  await this.crudService.create(user_topic_progress,{"user_id":user_id,"course_topic_id":curr_workshet_topic.course_topic_id,"status":"COMPLETED"})
            res.status(200).send(dispatcher(data,"success"));
            

        }catch(err){
            next(err)
        }
    }
} 
