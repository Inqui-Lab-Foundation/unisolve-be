import { Request, Response, NextFunction } from 'express';

import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import db from "../utils/dbconnection.util";
import { Op } from 'sequelize';

export default class DashboardController extends BaseController {
    model = "dashboardMapStats";

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
        super.initializeRoutes();
    }
    private async getMapStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size, district_name } = req.query;
            let condition = district_name ? { status: { [Op.like]: `%${district_name}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            if (district_name) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, {
                    attributes: [
                        'district_name',
                        'overall_schools',
                        'reg_schools',
                        'ideas',
                        'teams',
                        'status',
                        'created_at',
                        'created_by',
                        'updated_at',
                        'updated_by',
                        [
                            db.literal(`( SELECT COUNT(*) FROM students AS s WHERE s.district = \`dashboards\`.\`district_name\`)`), 'student teams'
                        ]
                    ],
                    where: {
                        [Op.and]: [
                            where
                        ]
                    },
                    // include: { model: support_ticket_reply, required: false }
                });
            } else {
                try {
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                        attributes: [
                            'district_name',
                            'overall_schools',
                            'reg_schools',
                            'ideas',
                            'teams',
                            'status',
                            'created_at',
                            'created_by',
                            'updated_at',
                            'updated_by',
                            [
                                db.literal(`( SELECT COUNT(*) FROM students AS s WHERE s.district = \`dashboards\`.\`district_name\`)`), 'student teams'
                            ]
                            //  ${ addWhereClauseStatusPart? "s." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral } AND
                        ],
                        where: {
                            [Op.and]: [
                                condition
                            ]
                        },
                        limit,
                        offset
                    })
                    const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    data = result;
                } catch (error: any) {
                    return res.status(500).send(dispatcher(data, 'error'))
                }
            }
            if (!data || data instanceof Error) {
                res.status(200).send(dispatcher(null, "error", speeches.DATA_NOT_FOUND));
            }
            return res.status(200).send(dispatcher(data, 'success'));
        } catch (error) {
            next(error);
        }
    };
};