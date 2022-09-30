import { Request, Response, NextFunction } from 'express';

import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import db from "../utils/dbconnection.util";
import { Op } from 'sequelize';
import DashboardMapStatsJob from '../jobs/dashboardMapStats.jobs';
import { dashboard_map_stat } from '../models/dashboard_map_stat.model';

export default class DashboardController extends BaseController {
    model = ""; ///this u will override in every function in this controller ...!!!

    protected initializePath(): void {
        this.path = '/dashboard';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(null, null);
    }
    protected initializeRoutes(): void {
        //example route to add
        //this.router.get(`${this.path}/`, this.getData);
        this.router.get(`${this.path}/mapStats`, this.getMapStats.bind(this))
        this.router.get(`${this.path}/refreshMapStats`, this.refreshMapStats.bind(this))
        super.initializeRoutes();
    }

    private async refreshMapStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const job = new DashboardMapStatsJob()
            const result = await job.executeJob();
            res.status(200).json(dispatcher(result,"success"))
        }catch(err){
            next(err);
        }
    }
    private async getMapStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            this.model = dashboard_map_stat.name
            return await this.getData(req,res,next)
        } catch (error) {
            next(error);
        }
    };
};