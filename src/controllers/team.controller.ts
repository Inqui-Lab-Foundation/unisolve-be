import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { teamSchema, teamUpdateSchema } from "../validations/team.validationa";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import db from "../utils/dbconnection.util"
import dispatcher from "../utils/dispatch.util";
import { badRequest, notFound } from "boom";
import { speeches } from "../configs/speeches.config";
import { team } from "../models/team.model";
import { student } from "../models/student.model";

export default class TeamController extends BaseController {

    model = "team";

    protected initializePath(): void {
        this.path = '/teams';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(teamSchema, teamUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        this.router.get(`${this.path}/:id/members`, this.getTeamMembers.bind(this));
        super.initializeRoutes();
    }
    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size, mentor_id } = req.query;
            // let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
            let condition = mentor_id ? { "mentor_id": mentor_id } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            const paramStatus: any = req.query.status;
            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, {
                    attributes: [
                        'team_name',
                        'team_id',
                        'mentor_id',
                        'status',
                        'created_at',
                        'created_by',
                        'updated_at',
                        'updated_by',
                        [
                            db.literal(`(
                            SELECT COUNT(*)
                            FROM students AS s
                            WHERE
                                ${addWhereClauseStatusPart ? "s." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                            AND
                                s.team_id = \`team\`.\`team_id\`
                        )`), 'student_count'
                        ]
                    ],
                    where: {
                        [Op.and]: [
                            whereClauseStatusPart,
                            where,
                        ]
                    }
                });
            } else {
                try {
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                        attributes: [
                            'team_name',
                            'team_id',
                            'mentor_id',
                            'status',
                            'created_at',
                            'created_by',
                            'updated_at',
                            'updated_by',
                            [
                                db.literal(`(
                            SELECT COUNT(*)
                            FROM students AS s
                            WHERE
                                ${addWhereClauseStatusPart ? "s." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                            AND
                                s.team_id = \`team\`.\`team_id\`
                        )`), 'student_count'
                            ]
                        ],
                        where: {
                            [Op.and]: [
                                whereClauseStatusPart,
                                condition
                            ]
                        }, limit, offset
                    })
                    const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    data = result;
                } catch (error: any) {
                    return res.status(500).send(dispatcher(res, data, 'error'))
                }

            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(res,data, 'error'));
            // }
            if (!data || data instanceof Error) {
                if (data != null) {
                    throw notFound(data.message)
                } else {
                    throw notFound()
                }
                res.status(200).send(dispatcher(res, null, "error", speeches.DATA_NOT_FOUND));
                // if(data!=null){
                //     throw 
                (data.message)
                // }else{
                //     throw notFound()
                // }
            }

            return res.status(200).send(dispatcher(res, data, 'success'));
        } catch (error) {
            next(error);
        }
    };
    protected async getTeamMembers(req: Request, res: Response, next: NextFunction) {
        // accept the team_id from the params and find the students details, user_id
        const team_id = req.params.id;
        if (!team_id || team_id === "") {
            return res.status(400).send(dispatcher(res, null, 'error', speeches.TEAM_NAME_ID));
        }
        const team_res = await this.crudService.findOne(team, { where: { team_id } });
        if (!team_res) {
            return res.status(400).send(dispatcher(res, null, 'error', speeches.TEAM_NOT_FOUND));
        }
        const where: any = { team_id };
        let whereClauseStatusPart: any = {};
        const paramStatus: any = req.query.status;
        if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
            whereClauseStatusPart = { "status": paramStatus }
        }
        const student_res = await this.crudService.findAll(student, {
            where: {
                [Op.and]: [
                    whereClauseStatusPart,
                    where
                ]
            }
        });
        return res.status(200).send(dispatcher(res, student_res, 'success'));
    };
    /**
     * 
     * Add check to see if team with same name and same mentor doesnt exits only then creeate a team 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    protected async createData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model } = req.params;
            if (model) {
                this.model = model;
            };
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded)
            const teamNameCheck: any = await team.findOne({
                where: {
                    mentor_id: payload.mentor_id,
                    team_name: payload.team_name
                }
            })
            console.log(teamNameCheck);
            if (teamNameCheck) {
                throw badRequest('code unique');
            } else {
                ///add check if teamNameCheck is not an error and has data then return and err
                const data = await this.crudService.create(modelLoaded, payload);
                // console.log(data)
                // if (!data) {
                //     return res.status(404).send(dispatcher(res,data, 'error'));
                // }
                if (!data) {
                    throw badRequest()
                }
                if (data instanceof Error) {
                    throw data;
                }

                return res.status(201).send(dispatcher(res, data, 'created'));
            }
        } catch (error) {
            next(error);
        }
    }
}