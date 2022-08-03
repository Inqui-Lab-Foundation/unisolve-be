import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { teamSchema, teamUpdateSchema } from "../validations/team.validationa";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import db from "../utils/dbconnection.util"
import dispatcher from "../utils/dispatch.util";
import { notFound } from "boom";
import { speeches } from "../configs/speeches.config";

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
        //this.router.get(`${this.path}/`, this.getData);
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
            const { page, size, title } = req.query;
            let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
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
                    return res.status(500).send(dispatcher(data, 'error'))
                }

            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                if (data != null) {
                    throw notFound(data.message)
                } else {
                    throw notFound()
                }
                res.status(200).send(dispatcher(null, "error", speeches.DATA_NOT_FOUND));
                // if(data!=null){
                //     throw 
                (data.message)
                // }else{
                //     throw notFound()
                // }
            }

            return res.status(200).send(dispatcher(data, 'success'));
        } catch (error) {
            next(error);
        }
    }
}