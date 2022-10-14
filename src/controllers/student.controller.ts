import { Request, Response, NextFunction } from 'express';
import { customAlphabet } from 'nanoid';

import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import { studentSchema, studentLoginSchema, studentUpdateSchema, studentChangePasswordSchema, studentResetPasswordSchema } from '../validations/student.validationa';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import validationMiddleware from '../middlewares/validation.middleware';
import { constents } from '../configs/constents.config';
import { Op } from 'sequelize';
import { notFound } from 'boom';

export default class StudentController extends BaseController {
    model = "student";
    authService: authService = new authService;
    private password = process.env.GLOBAL_PASSWORD;
    private nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789', 6);

    protected initializePath(): void {
        this.path = '/students';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(studentSchema, studentUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add
        //this.router.get(`${this.path}/`, this.getData);
        this.router.post(`${this.path}/register`, this.register.bind(this));
        this.router.post(`${this.path}/login`, validationMiddleware(studentLoginSchema), this.login.bind(this));
        this.router.get(`${this.path}/logout`, this.logout.bind(this));
        this.router.put(`${this.path}/changePassword`, validationMiddleware(studentChangePasswordSchema), this.changePassword.bind(this));
        // this.router.put(`${this.path}/updatePassword`, validationMiddleware(studentChangePasswordSchema), this.updatePassword.bind(this));
        this.router.post(`${this.path}/resetPassword`, validationMiddleware(studentResetPasswordSchema), this.resetPassword.bind(this));
        super.initializeRoutes();
    }
    private async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const generatedUUID = this.nanoid()
        if (!req.body.username || req.body.username === "") {
            req.body.username = generatedUUID
            req.body['UUID'] = generatedUUID;
        }
        if (!req.body.password || req.body.password === "") req.body.password = this.password;
        if (!req.body.role || req.body.role !== 'STUDENT') {
            return res.status(406).send(dispatcher(res,null, 'error', speeches.USER_ROLE_REQUIRED, 406));
        }
        const result = await this.authService.register(req.body);
        if (result.user_res) return res.status(406).send(dispatcher(res,result.user_res.dataValues, 'error', speeches.STUDENT_EXISTS, 406));
        return res.status(201).send(dispatcher(res,result.profile.dataValues, 'success', speeches.USER_REGISTERED_SUCCESSFULLY, 201));
    }
    private async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        let teamDetails: any;
        let studentDetails: any;
        let result;
        req.body['role'] = 'STUDENT'
        result = await this.authService.login(req.body);
        if (!result) {
            return res.status(404).send(dispatcher(res,result, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(401).send(dispatcher(res,result.error, 'error', speeches.USER_RISTRICTED, 401));
        } else {
            studentDetails = await this.authService.getServiceDetails('student', { user_id: result.data.user_id });
            teamDetails = await this.authService.getServiceDetails('team', { team_id: studentDetails.dataValues.team_id });
            result.data['team_id'] = studentDetails.dataValues.team_id;
            result.data['student_id'] = studentDetails.dataValues.student_id;
            if (!teamDetails) {
                result.data['mentor_id'] = null;
                result.data['team_name'] = null;
            } else {
                result.data['mentor_id'] = teamDetails.dataValues.mentor_id;
                result.data['team_name'] = teamDetails.dataValues.team_name;
            }
            return res.status(200).send(dispatcher(res,result.data, 'success', speeches.USER_LOGIN_SUCCESS));
        }
    }
    private async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.logout(req.body, res);
        if (result.error) {
            next(result.error);
        } else {
            return res.status(200).send(dispatcher(res,speeches.LOGOUT_SUCCESS, 'success'));
        }
    }
    private async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.changePassword(req.body, res);
        if (!result) {
            return res.status(404).send(dispatcher(res,null, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(404).send(dispatcher(res,result.error, 'error', result.error));
        }
        else if (result.match) {
            return res.status(404).send(dispatcher(res,null, 'error', speeches.USER_PASSWORD));
        } else {
            return res.status(202).send(dispatcher(res,result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        }
    }
    // private async updatePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    //     const result = await this.authService.updatePassword(req.body, res);
    //     if (!result) {
    //         return res.status(404).send(dispatcher(res,null, 'error', speeches.USER_NOT_FOUND));
    //     } else if (result.error) {
    //         return res.status(404).send(dispatcher(res,result.error, 'error', result.error));
    //     }
    //     else if (result.match) {
    //         return res.status(404).send(dispatcher(res,null, 'error', speeches.USER_PASSWORD));
    //     } else {
    //         return res.status(202).send(dispatcher(res,result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
    //     }
    // }
    private async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        // accept the user_id or user_name from the req.body and update the password in the user table
        const generatedUUID = this.nanoid()
        req.body['generatedPassword'] = generatedUUID;
        const result = await this.authService.restPassword(req.body, res);
        if (!result) {
            return res.status(404).send(dispatcher(res,result.user_res, 'error', speeches.USER_NOT_FOUND));
        } else if (result.match) {
            return res.status(404).send(dispatcher(res,result.match, 'error', speeches.USER_PASSWORD));
        } else {
            return res.status(202).send(dispatcher(res,result, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        }
    }
    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            const { model, id } = req.params;
            const paramStatus: any = req.query;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size, adult } = req.query;
            let condition = adult ? { UUID: null } : { UUID: { [Op.like]: `%%` } };
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            let whereClauseStatusPart: any = {};
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
            }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, {
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
                    return res.status(500).send(dispatcher(res,data, 'error'))
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
                res.status(200).send(dispatcher(res,null, "error", speeches.DATA_NOT_FOUND));
                // if(data!=null){
                //     throw 
                (data.message)
                // }else{
                //     throw notFound()
                // }
            }

            return res.status(200).send(dispatcher(res,data, 'success'));
        } catch (error) {
            next(error);
        }
    }   
}