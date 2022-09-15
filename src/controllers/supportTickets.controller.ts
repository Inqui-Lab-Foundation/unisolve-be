import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import { faq } from "../models/faq.model";
import dispatcher from "../utils/dispatch.util";
import { supportTickets, supportTicketsUpdateSchema } from "../validations/supportTicket.validation";
import ValidationsHolder from "../validations/validationHolder";
import BaseController from "./base.controller";
import db from "../utils/dbconnection.util";
import { support_ticket_reply } from "../models/support_ticket_reply.model";
import { badRequest } from "boom";


export default class SupportTicketController extends BaseController {

    model = "support_ticket"

    protected initializePath(): void {
        this.path = "/supportTickets";
    };
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(supportTickets, supportTicketsUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add 
        // this.router.get(`${this.path}/`, this.getData.bind(this));
        super.initializeRoutes();
    }
    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            // console.log('came here..>! 31')
            let data: any;
            const { model, id } = req.params;
            // const paramStatus: any = req.query.status;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size, status } = req.query;
            let condition = status ? { status: { [Op.like]: `%${status}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            // let whereClauseStatusPart: any = {};
            // let whereClauseStatusPartLiteral = "1=1";
            // let addWhereClauseStatusPart = false
            // if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
            //     whereClauseStatusPart = { "status": paramStatus }
            //     whereClauseStatusPartLiteral = `status = "${paramStatus}"`
            //     addWhereClauseStatusPart = true;
            // }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, {
                    where: {
                        [Op.and]: [
                            // whereClauseStatusPart,
                            where
                        ]
                    },
                    include: { model: support_ticket_reply, required: false }
                });
            } else {
                try {
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                        attributes: [
                            'support_ticket_id',
                            'query_category',
                            'query_details',
                            'status',
                            'created_at',
                            'created_by',
                            'updated_at',
                            'updated_by',
                            [
                                db.literal(`( SELECT COUNT(*) FROM support_tickets_replies AS s WHERE s.support_ticket_id = \`support_ticket\`.\`support_ticket_id\`)`), 'replies_count'
                            ]
                            //  ${ addWhereClauseStatusPart? "s." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral } AND
                        ],
                        where: {
                            [Op.and]: [
                                // whereClauseStatusPart,
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

    protected async updateData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const user_id = res.locals.user_id
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded)
            const data = await this.crudService.update(modelLoaded, payload, { where: where });
            if (!data || data instanceof Error) {
                throw badRequest(data.message)
            }
            return res.status(200).send(dispatcher(data, 'updated'));
        } catch (error) {
            next(error);
        }
    }
};