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
import { organizationSchema, organizationUpdateSchema } from "../validations/organization.validations";

export default class OrganizationController extends BaseController {

    model = "organization";

    protected initializePath(): void {
        this.path = '/organizations';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder( organizationSchema, organizationUpdateSchema);
    }
    protected initializeRoutes(): void {
        // this.router.post(`${this.path}`, this.createData);
        super.initializeRoutes();
    };
}
