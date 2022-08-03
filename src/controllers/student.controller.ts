import { Request, Response, NextFunction } from 'express';

import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import authService from '../services/auth.service';
import BaseController from './base.controller';

export default class StudentController extends BaseController {
    model = "student";
    authService: authService = new authService;
    private password = process.env.GLOBAL_PASSWORD;

    protected initializePath(): void {
        this.path = '/students';
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
        this.router.post(`${this.path}/resetPassword`, this.resetPassword.bind(this));
        super.initializeRoutes();
    }
    private async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        // status codes reference: https://www.restapitutorial.com/httpstatuscodes.html 
        // or https://umbraco.com/knowledge-base/http-status-codes/
        if (!req.body.username || req.body.username === "") req.body.username = req.body.full_name.replace('s / +/ /g', "");
        if (!req.body.password || req.body.password === "") req.body.password = this.password;
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
        const result = await this.authService.changePassword(req.body, res);
        if (!result) {
            return res.status(404).send(dispatcher(result.user_res, 'error', speeches.USER_NOT_FOUND));
        } else if (result.match) {
            return res.status(404).send(dispatcher(result.match, 'error', speeches.USER_PASSWORD));
        } else {
            return res.status(202).send(dispatcher(result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        }
    }
    private async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        // accept the user_id or user_name from the req.body and update the password in the user table
        const result = await this.authService.restPassword(req.body, res);
        if (!result) {
            return res.status(404).send(dispatcher(result.user_res, 'error', speeches.USER_NOT_FOUND));
        } else if (result.match) {
            return res.status(404).send(dispatcher(result.match, 'error', speeches.USER_PASSWORD));
        } else {
            return res.status(202).send(dispatcher(result, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        }
    }
};