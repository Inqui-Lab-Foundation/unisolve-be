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
        super.initializeRoutes();
    }
    private async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!req.body.organization_code || req.body.organization_code === "") return res.status(406).send(dispatcher(speeches.ORG_CODE_REQUIRED, 'error', speeches.NOT_ACCEPTABLE, 406));
        const org = await this.authService.checkOrgDetails(req.body.organization_code);
        if (!org) {
            return res.status(406).send(dispatcher(org, 'error', speeches.ORG_CODE_NOT_EXISTS, 406));
        }
        if (!req.body.role || req.body.role !== 'MENTOR') {
            return res.status(406).send(dispatcher(null, 'error', speeches.USER_ROLE_REQUIRED, 406));
        }
        const otp = Math.random().toFixed(6).substr(-6);
        const generateOtp = (mobile: any, otp: any) => axios.get(`https://veup.versatilesmshub.com/api/sendsms.php?api=0a227d90ef8cd9f7b2361b33abb3f2c8&senderid=YFSITS&channel=Trans&DCS=0&flashsms=0&number=${mobile}&text=Dear Student, A request for password reset had been generated. Your OTP for the same is ${otp} -Team Youth for Social Impact&SmsCampaignId=1&EntityID=1701164847193907676&DLT_TE_ID=1507165035646232522`)
            .then(resp => console.log(resp))
            .catch(error => console.error(error));
        req.body.password = otp;
        const result = await this.authService.register(req.body);
        if (result.user_res) {
            return res.status(406).send(dispatcher(result.user_res.dataValues, 'error', speeches.MENTOR_EXISTS, 406));
        }
        generateOtp(req.body.mobile, otp);
        const data = result.profile.dataValues;
        data['otp'] = otp;
        return res.status(201).send(dispatcher(data, 'success', speeches.USER_REGISTERED_SUCCESSFULLY, 201));
    }

    private async validateOtp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const user_res = await this.authService.crudService.findOnePassword(user, { where: { user_id: req.body.user_id } });
        const match = bcrypt.compareSync(req.body.otp, user_res.dataValues.password);
        if (!match) {
            res.status(404).send(dispatcher(null, 'error', speeches.OTP_FAIL))
        } else {
            res.status(200).send(dispatcher(match, 'success', speeches.OTP_FOUND))
        }
    }

    private async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const result = await this.authService.login(req.body);
        if (!result) {
            return res.status(404).send(dispatcher(result, 'error', speeches.USER_NOT_FOUND));
        } else if (result.error) {
            return res.status(401).send(dispatcher(result.error, 'error', speeches.USER_RISTRICTED, 401));
        } else {
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
        const user_res = await this.authService.crudService.findOne(user, { where: { user_id: req.body.user_id } });
        const result = await this.authService.changePassword(req.body, res);
        if (!result) {
            return res.status(404).send(dispatcher(result.user_res, 'error', speeches.USER_NOT_FOUND));
        } else if (result.match) {
            return res.status(404).send(dispatcher(result.match, 'error', speeches.USER_PASSWORD));
        } else {
            return res.status(202).send(dispatcher(result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        }
    }
};