import { badRequest, internal } from "boom";
import * as csv from "fast-csv";
import { NextFunction, Request, Response } from "express";
import fs from 'fs';
import { any, date } from "joi";
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
        //@ts-ignore
        let file = req.files.data;
        let Errors: any = [];
        let organizations: any = [];
        let counter: number = 0;
        let existedEntities: number = 0;
        let dataLength: number;
        if (file === undefined) {
            return res.status(400).send(dispatcher(null, 'error', 'file is required', 400));
        }
        if (file.type !== 'text/csv') {
            return res.status(400).send(dispatcher(null, 'error', 'CSV file is required', 400));
        }
        const modelLoaded = await this.loadModel(this.model);
        const stream = fs.createReadStream(file.path).pipe(csv.parse({ headers: true }));
        stream.on("error", (error) => {
            return res.status(400).send(dispatcher(error, 'error', 'error while reading the file date', 400));
        })
        stream.on('data', async (data: any) => {
            dataLength = Object.entries(data).length;
            if (dataLength > 0) {
                if (data.organization_name === '' || data.organization_code === '') {
                    Errors.push(badRequest('missing fields', data));
                    return;
                }
                organizations.push(data);
            }
        })
        stream.on('end', async () => {
            if (Errors.length > 0) next(badRequest(Errors.message));
            for (let data = 0; data < organizations.length; data++) {
                const payload = this.autoFillTrackingCollumns(req, res, modelLoaded, organizations[data]);
                const match = await this.crudService.findOne(modelLoaded, { where: { organization_name: organizations[data].organization_name } });
                if (match) {
                    existedEntities++;
                } else {
                    counter++;
                }
            }
            if (counter > 0) {
                await this.crudService.bulkCreate(modelLoaded, organizations)
                    .then((result) => {
                        return res.send(dispatcher({ data: result, createdEntities: counter, existedEntities }, 'success', 'created', 200));
                    }).catch((error: any) => {
                        return res.status(500).send(dispatcher(error, 'error', 'something went wrong', 500));
                    })
            } else if (existedEntities > 0) {
                return res.status(400).send(dispatcher({ createdEntities: counter, existedEntities }, 'error', 'error existing', 400));
            }
        });
    }
}
