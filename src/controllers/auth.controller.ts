import { Router, Request, Response, NextFunction } from 'express';
import IController from '../interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import validationMiddleware from '../middlewares/validation.middleware';
import authValidations from '../validations/auth.validations';
import CRUDService from '../services/crud.service';
import jwtUtil from '../utils/jwt.util';
import { isNull } from 'lodash';
import { user } from '../models/user.model';
import buildResponse from '../utils/build_response';

export default class AuthController implements IController {
    public path: string;
    public router: Router;
    crudService: CRUDService = new CRUDService;
    public userModel:any = new user();

    constructor() {
        this.path = '/auth';
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.post(`${this.path}/login`, validationMiddleware(authValidations.login), this.login);
        this.router.post(`${this.path}/register`, validationMiddleware(authValidations.register), this.register);
    }

    private loadModel = async (model: string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${model}.model`);
        return modelClass[model];
    }

    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user_res: any = await this.crudService.findOne(user, { where: { email:req.body.email, password:req.body.password } });
            if (!user_res) {
                throw new HttpException(404, 'User not found');
            }else{
                const token = await jwtUtil.createToken(user_res.dataValues, `${process.env.PRIVATE_KEY}`);
                return res.status(200).send({
                    token,
                    type: 'Bearer',
                    expire: process.env.TOKEN_DEFAULT_TIMEOUT
                });
            }
        } catch (error) {
            next(error);
        }
    }

    private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { email } = req.body;
            this.loadModel('user').then(async (modelClass: any) => {
                const user: any = await this.crudService.findOne(modelClass, { where: { email } });
                if (user) throw new HttpException(404, 'User already registered');
                const result = await this.crudService.create(modelClass, req.body);
                return res.status(201).send(buildResponse({
                    // info: result,
                    message: 'user registered successfully.'
                }));
            }).catch(next);
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