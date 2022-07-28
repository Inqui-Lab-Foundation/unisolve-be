import { Request, Response, NextFunction } from 'express';

import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import { user } from '../models/user.model';
import { URL } from 'url';

export default class MentorController extends BaseController {
    model = "mentor";
    authService: authService = new authService;
    private password = process.env.GLOBAL_PASSWORD;

    protected initializePath(): void {
        this.path = '/mentors';
    }
    protected initializeValidations(): void {
        // this.validations = new ValidationsHolder(teamSchema, teamUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add
        //this.router.get(`${this.path}/`, this.getData);
        this.router.post(`${this.path}/register`, this.register.bind(this));
        this.router.post(`${this.path}/login`, this.login.bind(this));
        this.router.get(`${this.path}/logout`, this.logout.bind(this));
        this.router.put(`${this.path}/changePassword`, this.changePassword.bind(this));
        super.initializeRoutes();
    }
    private async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        // const checkOrgCode = await this.authService.checkOrgDetails(req.body.organization_code);
        // if (!checkOrgCode || checkOrgCode instanceof Error) {
        //     res.status(400).send(dispatcher(null, 'error', speeches.BAD_REQUEST))
        // }
        // if (!req.body.username || req.body.username === "") req.body.username = req.body.full_name.replace('s / +/ /g', "");
        // if (!req.body.password || req.body.password === "") req.body.password = this.password;
        const otp = Math.random().toFixed(6).substr(-6)
        const generateOtp = (mobile: any, otp: any) => new URL(`https://veup.versatilesmshub.com/api/sendsms.php?api=0a227d90ef8cd9f7b2361b33abb3f2c8&senderid=YFSITS&channel=Trans&DCS=0&flashsms=0&number=${mobile},9619118917&text=Dear Student, A request for password reset had been generated. Your OTP for the same is ${otp} -Team Youth for Social Impact&SmsCampaignId=1&EntityID=1701164847193907676&DLT_TE_ID=1507165035646232522`);
        generateOtp(req.body.mobile, otp);
        req.body["password"] = otp;
        const result = await this.authService.register(req.body);
        if (result === false) return res.status(406).send(dispatcher(speeches.USER_ALREADY_EXISTED, 'error', speeches.NOT_ACCEPTABLE, 406));
        return res.status(201).send(dispatcher(result, 'success', speeches.USER_REGISTERED_SUCCESSFULLY, 201));
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