import { Router, Request, Response, NextFunction } from 'express';
import IController from '../interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import validationMiddleware from '../middlewares/validation.middleware';
import authValidations from '../validations/auth.validations';
import CRUDService from '../services/crud.service';
import jwtUtil from '../utils/jwt.util';
import { user } from '../models/user.model';
import dispatcher from '../utils/dispatch.util';
import { speeches } from '../configs/speeches.config';
import { Op } from 'sequelize';

export default class AuthController implements IController {
    public path: string;
    public router: Router;
    crudService: CRUDService = new CRUDService;
    public userModel: any = new user();

    constructor() {
        this.path = '/auth';
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.post(`${this.path}/login`, validationMiddleware(authValidations.login), this.login);
        this.router.get(`${this.path}/logout`, this.logout);
        this.router.post(`${this.path}/register`, validationMiddleware(authValidations.register), this.register);
    }

    private loadModel = async (model: string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${model}.model`);
        return modelClass[model];
    }

    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user_res: any = await this.crudService.findOne(user, { where: { email: req.body.email, password: req.body.password } });
            if (!user_res) {
                return res.status(200).send(dispatcher(user_res, 'error', speeches.USER_NOT_FOUND));
            } else {
                // user status checking
                let stop_procedure: boolean = false;
                let error_message: string = '';

                if (user_res.status == 'DELETED') {
                    stop_procedure = true;
                    error_message = speeches.USER_DELETED;
                } else if (user_res.status == 'LOCKED') {
                    stop_procedure = true;
                    error_message = speeches.USER_LOCKED;
                } else if (user_res.status == 'INACTIVE') {
                    stop_procedure = true;
                    error_message = speeches.USER_INACTIVE;
                }
                if (stop_procedure) {
                    return res.status(401).send(dispatcher(error_message, 'error', speeches.USER_RISTRICTED, 401));
                }

                const update_res = await this.crudService.update(user, {
                    is_loggedin: "YES",
                    last_login: new Date().toLocaleString()
                }, { where: { user_id: user_res.user_id } });

                const token = await jwtUtil.createToken(user_res.dataValues, `${process.env.PRIVATE_KEY}`);
                return res.status(200).send(dispatcher({
                    token,
                    type: 'Bearer',
                    expire: process.env.TOKEN_DEFAULT_TIMEOUT
                }, 'success', speeches.USER_LOGIN_SUCCESS));
            }
        } catch (error) {
            next(error);
        }
    }

    private logout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const update_res = await this.crudService.update(user, {
                is_loggedin: "NO"
            }, { where: { user_id: res.locals.user_id } });
            return res.status(200).send(dispatcher(speeches.LOGOUT_SUCCESS, 'success'));
        } catch (error) {
            next(error);
        }
    }

    private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        // status codes reference: https://www.restapitutorial.com/httpstatuscodes.html 
        // or https://umbraco.com/knowledge-base/http-status-codes/
        try {
            const user_res: any = await this.crudService.findOne(user, {
                where: {
                    [Op.or]: [
                        {
                            email: { [Op.eq]: req.body.email }
                        }, 
                        {
                            mobile: { [Op.like]: `%${req.body.mobile}%` }
                        }
                    ]
                }
            });
            if (user_res) return res.status(406).send(dispatcher(speeches.USER_ALREADY_EXISTED, 'error', speeches.NOT_ACCEPTABLE, 406));

            const result = await this.crudService.create(user, req.body);
            return res.status(201).send(dispatcher(result, 'success', speeches.USER_REGISTERED_SUCCESSFULLY));
        } catch (error) {
            next(error);
        }
    }

    // public async createSignupConfig(req: Request, res: Response) {
    //     const result: any = new Object();
    //     for (let i in /*dynamicSignupFormMasterObject*/) {
    //         for (let j in Object.keys(req.body)) {
    //             if (i === Object.keys(req.body)[j]) {
    //                 result[i] = /*dynamicSignupFormMasterObject[i]*/
    //             }
    //         }
    //     }
    //     new Promise((resolve, reject) => {
    //         writeFile('./dist/config/singUp.json', JSON.stringify(result), function (err) {
    //             if (err) {
    //                 reject;
    //                 return res.status(503).json({ message: 'Oops, Something went wrong. Please check the payload and try again', err });
    //             } else {
    //                 resolve;
    //                 return res.status(200).json({ message: "successfully created json file" });
    //             }
    //         });
    //     });
    // };

    // public async getSignUpConfig(req: Request, res: Response) {
    //     var options = {
    //         root: path.join(process.cwd(), '/dist/config'),
    //         headers: {
    //             'x-timestamp': Date.now(),
    //             'x-sent': true
    //         }
    //     };
    //     return res.status(200).sendFile('singUp.json', options);
    // }
}