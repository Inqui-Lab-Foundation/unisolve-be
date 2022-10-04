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
import { organizationCheckSchema, organizationRawSchema, organizationSchema, organizationUpdateSchema } from "../validations/organization.validations";
import authService from "../services/auth.service";
import validationMiddleware from "../middlewares/validation.middleware";

export default class OrganizationController extends BaseController {

    model = "organization";
    authService: authService = new authService;

    protected initializePath(): void {
        this.path = '/organizations';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(organizationSchema, organizationUpdateSchema);
    }
    protected initializeRoutes(): void {
        this.router.post(`${this.path}/bulkUpload`, this.bulkUpload.bind(this));
        this.router.post(`${this.path}/checkOrg`, validationMiddleware(organizationCheckSchema), this.checkOrgDetails.bind(this));
        this.router.post(`${this.path}/createOrg`, validationMiddleware(organizationRawSchema), this.createOrg.bind(this));
        super.initializeRoutes();
    };
    private async checkOrgDetails(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const org = await this.authService.checkOrgDetails(req.body.organization_code);
        if (!org) {
            res.status(400).send(dispatcher(null, 'error', speeches.BAD_REQUEST))
        } else {
            res.status(200).send(dispatcher(org, 'success', speeches.FETCH_FILE));
        }
    }

    private async createOrg(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        // console.log(req.body);
        return this.createData(req,res,next);
    }
}
