import bcrypt from 'bcrypt';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

import { speeches } from '../configs/speeches.config';
import { baseConfig } from '../configs/base.config';
import { user } from '../models/user.model';
import { mentorSchema, mentorUpdateSchema } from '../validations/mentor.validationa';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import { badRequest } from 'boom';
import { mentor } from '../models/mentor.model';
import { where } from 'sequelize/types';

export default class MentorController extends BaseController {
    model = "mentor";
    authService: authService = new authService;
    private password = process.env.GLOBAL_PASSWORD;

    protected initializePath(): void {
        this.path = '/mentors';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(mentorSchema, mentorUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add
        //this.router.get(`${this.path}/`, this.getData);
        this.router.post(`${this.path}/register`, this.register.bind(this));
        this.router.post(`${this.path}/validateOtp`, this.validateOtp.bind(this));
        this.router.post(`${this.path}/login`, this.login.bind(this));
        this.router.get(`${this.path}/logout`, this.logout.bind(this));
        this.router.put(`${this.path}/changePassword`, this.changePassword.bind(this));
        this.router.put(`${this.path}/updatePassword`, this.updatePassword.bind(this));
        this.router.put(`${this.path}/verifyUser`, this.verifyUser.bind(this));
        this.router.put(`${this.path}/updateMobile`, this.updateMobile.bind(this));
        super.initializeRoutes();
    }
    // TODO: update the register flow by adding a flag called reg_statue in mentor tables
    private async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!req.body.organization_code || req.body.organization_code === "") return res.status(406).send(dispatcher(speeches.ORG_CODE_REQUIRED, 'error', speeches.NOT_ACCEPTABLE, 406));
        const org = await this.authService.checkOrgDetails(req.body.organization_code);
        if (!org) {
            return res.status(406).send(dispatcher(org, 'error', speeches.ORG_CODE_NOT_EXISTS, 406));
        }
        if (!req.body.role || req.body.role !== 'MENTOR') {
            return res.status(406).send(dispatcher(null, 'error', speeches.USER_ROLE_REQUIRED, 406));
        }
        const otp = await this.authService.generateOtp();
        req.body.password = otp;
        req.body['reg_status'] = 1;
        const result = await this.authService.register(req.body);
        if (result.user_res) {
            return res.status(406).send(dispatcher(result.user_res.dataValues, 'error', speeches.MENTOR_EXISTS, 406));
        }
        this.authService.triggerOtpMsg(req.body.mobile, otp); //async function but no need to await ...since we yet do not care about the outcome of the sms trigger ....!!this may need to change later on ...!!
        const data = result.profile.dataValues;
        data['otp'] = otp;
        return res.status(201).send(dispatcher(data, 'success', speeches.USER_REGISTERED_SUCCESSFULLY, 201));
    }

    // TODO: Update flag reg_status on success validate the OTP
    private async validateOtp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const user_res = await this.authService.validatedOTP(req.body);
        if (!user_res) {
            res.status(404).send(dispatcher(null, 'error', speeches.OTP_FAIL))
        } else {
            res.status(200).send(dispatcher(user_res, 'success', speeches.OTP_FOUND))
        }
    }

    private async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        req.body['role'] = 'MENTOR'
        const result = await this.authService.login(req.body);
        // console.log(result);
        if (!result) {
            return res.status(404).send(dispatcher(result, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(401).send(dispatcher(result.error, 'error', speeches.USER_RISTRICTED, 401));
        } else {
            const mentorData = await this.authService.crudService.findOne(mentor, { where: { user_id: result.data.user_id } });
            if (mentorData.dataValues.reg_status !== '3') {
                return res.status(404).send(dispatcher(null, 'error', speeches.USER_REG_STATUS));
            }
            return res.status(200).send(dispatcher(result.data, 'success', speeches.USER_LOGIN_SUCCESS));
        }
    }

    private async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.logout(req.body, res);
        if (result.error) {
            next(result.error);
        } else {
            return res.status(200).send(dispatcher(speeches.LOGOUT_SUCCESS, 'success'));
        }
    }

    private async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.changePassword(req.body, res);
        if (!result) {
            return res.status(404).send(dispatcher(null, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(404).send(dispatcher(result.error, 'error', result.error));
        }
        else if (result.match) {
            return res.status(404).send(dispatcher(null, 'error', speeches.USER_PASSWORD));
        } else {
            return res.status(202).send(dispatcher(result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        }
    }

    //TODO: Update flag reg_status on successful changed password
    private async updatePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.updatePassword(req.body, res);
        if (!result) {
            return res.status(404).send(dispatcher(null, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(404).send(dispatcher(result.error, 'error', result.error));
        }
        else if (result.match) {
            return res.status(404).send(dispatcher(null, 'error', speeches.USER_PASSWORD));
        } else {
            return res.status(202).send(dispatcher(result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        }
    }

    private async verifyUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const mobile = req.body.mobile;
            if (!mobile) {
                throw badRequest(speeches.MOBILE_NUMBER_REQUIRED);
            }
            const result = await this.authService.verifyUser(req.body, res);
            if (!result) {
                return res.status(404).send(dispatcher(null, 'error', speeches.USER_NOT_FOUND));
            } else if (result.error) {
                return res.status(404).send(dispatcher(result.error, 'error', result.error));
            } else {
                return res.status(202).send(dispatcher(result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
            }
        } catch (err) {
            next(err);
        }
    }
    //TODO: ADD API to update the mobile number and trigger OTP,
    private async updateMobile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { mobile } = req.body;
            if (!mobile) {
                throw badRequest(speeches.MOBILE_NUMBER_REQUIRED);
            }
            const result = await this.authService.mobileUpdate(req.body);
            if (!result) {
                return res.status(404).send(dispatcher(null, 'error', speeches.USER_NOT_FOUND));
            } else if (result.error) {
                return res.status(404).send(dispatcher(result.error, 'error', result.error));
            } else {
                return res.status(202).send(dispatcher(result.data, 'accepted', speeches.USER_MOBILE_CHANGE, 202));
            }
        } catch (error) {
            next(error)
        }
    }
};