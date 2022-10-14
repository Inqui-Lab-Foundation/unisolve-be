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
import { constents } from '../configs/constents.config';

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
        this.router.get(`${this.path}/mentorStats/:mentor_id/progessOverall`, this.getMentorStatsProgressOverall.bind(this))

        super.initializeRoutes();
    }
    private async getMentorStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const {mentor_id} = req.params;
            const paramStatus:any= req.query.status;
            let whereClauseStatusPart:any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if(paramStatus && (paramStatus in constents.common_status_flags.list)){
                whereClauseStatusPart = {"status":paramStatus}
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart =true;
            }

            const mentor_stats = await mentor.findOne({
                where:{
                    mentor_id:mentor_id,
                },
                attributes:[
                    [
                        db.literal(`(
                        select count(s.student_id) 
                        from students as s
                        where 
                        ${addWhereClauseStatusPart?"s."+whereClauseStatusPartLiteral:whereClauseStatusPartLiteral}
                        and s.team_id in (
                            select team_id 
                            from teams as t
                            where 
                            ${addWhereClauseStatusPart?"t."+whereClauseStatusPartLiteral:whereClauseStatusPartLiteral}
                            and t.mentor_id=\`mentor\`.\`mentor_id\`)
                            )`),
                        "students_count"
                    ],
                    [
                        db.literal(`(
                        select count(c.team_id) 
                        from challenge_responses as c 
                        where c.team_id in (
                            select team_id 
                            from teams as t
                            where 
                            ${addWhereClauseStatusPart?"t."+whereClauseStatusPartLiteral:whereClauseStatusPartLiteral}
                            and t.mentor_id=\`mentor\`.\`mentor_id\`) 
                        and c.status not in ('DRAFT')
                        )`),
                        "ideas_count"
                    ],
                    [
                        db.literal(`(
                        select count(t.team_id) 
                        from teams as t
                        where 
                        ${addWhereClauseStatusPart?"t."+whereClauseStatusPartLiteral:whereClauseStatusPartLiteral}
                        and t.mentor_id=\`mentor\`.\`mentor_id\`
                        )`),
                        "teams_count"
                    ]
                ],
                include:{
                    model:organization,
                    attributes:[
                        'organization_name',
                        'district'
                    ]

                }
            })
            if(mentor_stats instanceof Error){
                throw mentor_stats
            }
            if(mentor_stats){
                res.status(200).json(dispatcher(res,mentor_stats,"success"))
            }else{
                res.status(500).json(dispatcher(res,"somethign went wrong","error"))
            }
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