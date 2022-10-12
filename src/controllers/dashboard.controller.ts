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
import DashboardService from '../services/dashboard.service';
import { mentor } from '../models/mentor.model';
import { organization } from '../models/organization.model';

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

        ///map stats
        this.router.get(`${this.path}/refreshMapStatsLive`, this.getMapStatsLive.bind(this))
        this.router.get(`${this.path}/mapStats`, this.getMapStats.bind(this))
        this.router.get(`${this.path}/refreshMapStats`, this.refreshMapStats.bind(this))
        

        //mentor stats...
        this.router.get(`${this.path}/mentorStats/:mentor_id`, this.getMentorStats.bind(this))
        this.router.get(`${this.path}/mentorStats/:mentor_id/teamsCount`, this.getMentorStatsTeamCount.bind(this))
        this.router.get(`${this.path}/mentorStats/:mentor_id/studentCount`, this.getMentorStatsStudentCount.bind(this))
        this.router.get(`${this.path}/mentorStats/:mentor_id/ideasCount`, this.getMentorStatsIdeaCount.bind(this))
        this.router.get(`${this.path}/mentorStats/:mentor_id/progessOverall`, this.getMentorStatsProgressOverall.bind(this))

        super.initializeRoutes();
    }
    private async getMentorStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const {mentor_id} = req.params;
            mentor.findOne({
                where:{
                    mentor_id:mentor_id,
                },
                attributes:[
                    [
                        db.literal('select count(user_id) from student where team_id in (select team_id from teams where)'),"no_of_students"
                    ]
                ],
                include:{
                    model:organization
                }
            })

        }catch(err){
            next(err)
        }
    }
    private async getMentorStatsTeamCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{

        }catch(err){
            next(err)
        }
    }
    private async getMentorStatsStudentCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{

        }catch(err){
            next(err)
        }
    }
    private async getMentorStatsIdeaCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{

        }catch(err){
            next(err)
        }
    }
    private async getMentorStatsProgressOverall(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{

        }catch(err){
            next(err)
        }
    }
    private async refreshMapStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const job = new DashboardMapStatsJob()
            const result = await job.executeJob();
            res.status(200).json(dispatcher(res,result,"success"))
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

    private async getMapStatsLive(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const service = new DashboardService()
            await service.resetMapStats()
            this.model = dashboard_map_stat.name
            return await this.getData(req,res,next)
        } catch (error) {
            next(error);
        }
    };
};