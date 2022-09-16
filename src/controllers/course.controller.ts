import { unauthorized } from "boom";
import { NextFunction, Request, Response } from "express";
import dispatcher from "../utils/dispatch.util";

import BaseController from "./base.controller";
import ValidationsHolder from "../validations/validationHolder";
import { courseSchema, courseUpdateSchema } from "../validations/course.validations";
import { course_module } from "../models/course_module.model";
import { course_topic } from "../models/course_topic.model";
import db from "../utils/dbconnection.util"
import { constents } from "../configs/constents.config";
import { speeches } from "../configs/speeches.config";
import { Op } from "sequelize";
import translation from "resources/static/uploads/te/translation";
export default class CourseController extends BaseController {
    model = "course";

    protected initializePath(): void {
        this.path = '/courses';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(courseSchema, courseUpdateSchema);
    }

    protected initializeRoutes(): void {
        //example route to add 
        //this.router.get(`${this.path}/`, this.getData);
        this.router.get(`${this.path}/test`, this.testRoute);
        super.initializeRoutes();

    }
    protected testRoute(req: Request, res: Response, next: NextFunction) {
        // console.log("came here");
        return res.status(200).json(dispatcher("this was a success ....!!!"));
    }


    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            let course_modules: any;
            let course_topics: any;
            let courses: any;
            const { model, id } = req.params;
            const paramStatus: any = req.query.status
            if (model) {
                this.model = model;
            };

            // pagination
            const { page, size, title, locale } = req.query;
            let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model);
            modelClass.locale = locale ? locale : 'en';
            if (locale) {
                console.log("modelClass: ", modelClass.tableName, "locale: ", locale);
                course_modules = translation[`${locale}`].COURSE_MODULES
                course_topics = translation[`${locale}`].COURSE_TOPICS
                courses = translation[`${locale}`].COURSES
            }

            const where: any = {};

            let whereClauseStatusPart: any = {};
            let whereClauseStatusPartLiteral = "1=1";
            let addWhereClauseStatusPart = false
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
                whereClauseStatusPartLiteral = `status = "${paramStatus}"`
                addWhereClauseStatusPart = true;
            }


            if (id) {
                // where[`${this.model}_id`] = req.params.id;
                data = await this.getDetailsData(req, res, modelClass)
            } else {
                // where[`${this.model}_id`] = req.params.id;
                // data = await this.crudService.findAll(modelClass);
                data = await modelClass.findAll({
                    attributes: {
                        include: [
                            [// Note the wrapping parentheses in the call below!
                                db.literal(`(
                                    SELECT COUNT(*)
                                    FROM ${course_modules} AS cm
                                    WHERE
                                        ${addWhereClauseStatusPart ? "cm." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                                    AND
                                        cm.course_id = \`${courses}\`.\`course_id\`
                                )`),
                                'course_modules_count'
                            ],
                            [// Note the wrapping parentheses in the call below!
                                db.literal(`(
                                SELECT COUNT(*)
                                FROM ${course_topics} AS ct
                                JOIN ${course_modules} as cm on cm.course_module_id = ct.course_module_id
                                WHERE
                                    ${addWhereClauseStatusPart ? "ct." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                                AND
                                    cm.course_id = \`${courses}\`.\`course_id\`
                                AND
                                    ct.topic_type = \"VIDEO\"
                            )`),
                                'course_videos_count'
                            ]
                        ]
                    },
                    where: {
                        [Op.and]: [
                            whereClauseStatusPart,
                            condition,
                        ]
                    }
                });
                data.filter(function (rec: any) {
                    delete rec.dataValues.password;
                    return rec;
                });
            }

            if (!data) {
                return res.status(404).send(dispatcher(data, 'error'));
            }
            return res.status(200).send(dispatcher(data, 'success'));
        } catch (error) {
            next(error);
        }
    }

    async getDetailsData(req: Request, res: Response, modelClass: any) {
        let whereClause: any = {};
        let course_modules: any;
        let course_topics: any;
        let courses: any;

        whereClause[`${this.model}_id`] = req.params.id;

        const paramStatus: any = req.query.status;
        let whereClauseStatusPart: any = {};
        let whereClauseStatusPartLiteral = "1=1";
        let addWhereClauseStatusPart = false
        if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
            whereClauseStatusPart = { "status": paramStatus }
            whereClauseStatusPartLiteral = `status = "${paramStatus}"`
            addWhereClauseStatusPart = true;
        }
        const { page, size, title, locale } = req.query;
        if (locale) {
            console.log("modelClass: ", modelClass.tableName, "locale: ", locale);
            course_modules = translation[`${locale}`].COURSE_MODULES
            course_topics = translation[`${locale}`].COURSE_TOPICS
            courses = translation[`${locale}`].COURSES
        }

        let user_id = res.locals.user_id;
        if (!user_id) {
            throw unauthorized(speeches.UNAUTHORIZED_ACCESS)
        }
        let data = await this.crudService.findOne(modelClass, {
            where: whereClause,

            attributes: {
                include: [
                    [// Note the wrapping parentheses in the call below!
                        db.literal(`(
                            SELECT COUNT(*)
                            FROM ${course_modules} AS cm
                            WHERE
                                ${addWhereClauseStatusPart ? "cm." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                            AND
                                cm.course_id = \`course\`.\`course_id\`
                        )`),
                        'course_modules_count'
                    ],
                    [// Note the wrapping parentheses in the call below!
                        db.literal(`(
                        SELECT COUNT(*)
                        FROM ${course_topics} AS ct
                        JOIN ${course_modules} as cm on cm.course_module_id = ct.course_module_id
                        WHERE
                            ${addWhereClauseStatusPart ? "ct." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                        AND
                            cm.course_id = \`course\`.\`course_id\`
                        AND
                            ct.topic_type = \"VIDEO\"
                    )`),
                        'course_videos_count'
                    ]
                ]
            },
            include: [{
                model: course_module,
                as: 'course_modules',
                required: false,
                attributes: [
                    "title",
                    "description",
                    "course_module_id",
                    "course_id",
                    [
                        db.literal(`(
                            SELECT COUNT(*)
                            FROM ${course_topics} AS ct
                            WHERE
                                ${addWhereClauseStatusPart ? "ct." + whereClauseStatusPartLiteral : whereClauseStatusPartLiteral}
                            AND
                                ct.course_module_id = \`course_modules\`.\`course_module_id\`
                            AND
                                ct.topic_type = "VIDEO"
                        )`),
                        'videos_count'
                    ]
                ],
                where: {
                    [Op.and]: [
                        whereClauseStatusPart
                    ]
                },
                include: [{
                    model: course_topic,
                    as: "course_topics",
                    required: false,
                    attributes: [
                        "title",
                        "course_module_id",
                        "course_topic_id",
                        "topic_type_id",
                        "topic_type",
                        [
                            // Note the wrapping parentheses in the call below!
                            db.literal(`(
                                SELECT CASE WHEN EXISTS 
                                    (SELECT status 
                                    FROM user_topic_progress as p 
                                    WHERE p.user_id = ${user_id} 
                                    AND p.course_topic_id = \`course_modules->course_topics\`.\`course_topic_id\`) 
                                THEN  
                                    (SELECT case p.status when NULL then "INCOMPLETE" ELSE p.status END AS progress 
                                    FROM user_topic_progress AS p
                                    WHERE p.course_topic_id = \`course_modules->course_topics\`.\`course_topic_id\`
                                    AND p.user_id = ${user_id}
                                    ORDER BY p.updated_at DESC
                                    LIMIT 1)
                                ELSE 
                                    '${constents.task_status_flags.default}'
                                END as progress
                            )`),
                            'progress'
                        ],
                        [
                            db.literal(`(
                                SELECT video_duration
                                FROM videos AS ct
                                WHERE
                                ct.video_id = \`course_modules->course_topics\`.\`topic_type_id\`
                                AND
                                \`course_modules->course_topics\`.\`topic_type\` = "VIDEO"
                            )`),
                            'video_duration'
                        ],
                        [
                            db.literal(`(
                                SELECT 
                                CASE
                                    WHEN ct.topic_type = "VIDEO" THEN 1
                                    WHEN ct.topic_type = "QUIZ" THEN 2
                                    WHEN ct.topic_type = "WORKSHEET" THEN 3
                                END AS topic_type_order
                                FROM ${course_topics} as ct
                                WHERE ct.course_topic_id = \`course_modules->course_topics\`.\`course_topic_id\`
                            )`),
                            'topic_type_order'
                        ]
                    ],
                    where: {
                        [Op.and]: [
                            whereClauseStatusPart
                        ]
                    },
                }]
            }
            ],
            order: [
                // [{model: course_module, as: 'course_modules'},{model: course_topic, as: 'course_topics'},'topic_type_order', 'ASC'],
                db.literal(`\`course_modules.course_topics.topic_type_order\` ASC`),
                [course_module, course_topic, 'course_topic_id', 'ASC'],
            ],
        });
        return data;
    }

}