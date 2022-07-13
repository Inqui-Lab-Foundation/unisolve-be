import { badRequest, internal } from "boom";
import csvParser from "csv-parser";
import { NextFunction, Request, Response } from "express";
import fs from 'fs';
import { date } from "joi";
import path from 'path';
import { speeches } from "../configs/speeches.config";
import dispatcher from "../utils/dispatch.util";
import ValidationsHolder from "../validations/validationHolder";
import { videoSchema, videoUpdateSchema } from "../validations/video.validations";
import BaseController from "./base.controller";

export default class OrganizationController extends BaseController {

    model = "organization";

    protected initializePath(): void {
        this.path = '/organizations';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(null, null);;
    }
    protected initializeRoutes(): void {
        // this.router.post(`${this.path}`, this.createData);
        this.router.post(`${this.path}/withFile`, this.createDataWithFile.bind(this));
        super.initializeRoutes();
    };
    protected async createDataWithFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const Error: any = [];
        //@ts-ignore
        if (req.files.data === undefined) {
            console.log('first')
            throw badRequest();
        }
        //@ts-ignore
        const stream = fs.createReadStream(req.files.data.path).pipe(csvParser());
        stream.on('data', async (data: any) => {
            if (Object.entries(data).length > 0) {
                const modelLoaded = await this.loadModel(this.model);
                const payload = this.autoFillTrackingCollumns(req, res, modelLoaded, data);
                const preLoadedData: any = await this.crudService.findOne(modelLoaded, { where: { organization_name: data.organization_name } });
                if (preLoadedData) {
                    Error.push(badRequest().message);
                } else {
                    await this.crudService.create(modelLoaded, payload);
                }
            }
        })
        stream.on('error', error => Error.push(error));
        stream.on('end', () => {
            if (Error.length > 0) {
                next(badRequest());
            } else {
                res.send(dispatcher(null, 'success', 'created', 200));
            }
        });
    }
}