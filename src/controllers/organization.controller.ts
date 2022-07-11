import csvParser from "csv-parser";
import { NextFunction, Request, Response } from "express";
import fs from 'fs';
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
        const rawfiles: any = req.files;
        const files: any = Object.values(rawfiles);
        for (const file_name of Object.keys(files)) {
            const file = files[file_name];
            const stream = fs.createReadStream(file.path).pipe(csvParser());
            stream.on('data', async (data: any) => {
                if (Object.entries(data).length > 0) {
                    // console.log('fetch: ', data, 'length: ', Object.entries(data).length);
                    const modelLoaded = await this.loadModel(this.model);
                    const payload = this.autoFillTrackingCollumns(req, res, modelLoaded, data);
                    const preLoadedData: any = this.crudService.findOne(modelLoaded, { where: { organization_name: data.organization_name } });
                    if (preLoadedData) {
                        console.log('data existing');
                    } else {
                        await this.crudService.create(modelLoaded, payload);
                    }
                }
            })
            stream.on('end', () => res.send({ message: 'success' }));
            stream.on('error', (error: any) => res.send({ message: error }));
        }
    }
}