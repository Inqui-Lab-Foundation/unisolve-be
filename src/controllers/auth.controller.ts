import { Router, Request, Response, NextFunction} from 'express';
import IController from '../interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import validationMiddleware from '../middlewares/validation.middleware';
import authValidations from '../validations/auth.validations';
import CRUDService from '../services/crud.service';
import jwtUtil from '../utils/jwt.util';

export default class AuthController implements IController {
    public path: string;
    public router: Router;
    crudService:CRUDService = new CRUDService;

    constructor() {
        this.path = '/auth';
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.post(`${this.path}/login`, validationMiddleware(authValidations.login), this.login);
        this.router.post(`${this.path}/register`, validationMiddleware(authValidations.register), this.register);
    }

    private loadModel = async (model:string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${model}.model`);
        return modelClass[model];
    }

    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            this.loadModel('user').then(async (modelClass: any) => {
                const user:any = await this.crudService.findOne(modelClass, { where: { email, password } });
                if (!user) {
                    throw new HttpException(404, 'User not found');
                }
                const token = await jwtUtil.createToken(user.dataValues);
                console.log(token)
                return res.status(200).send({token,
                    type: 'Bearer',
                    expaire: process.env.TOKEN_DEFAULT_TIMEOUT
                });
            });
        } catch (error) {
            next(error);
        }
    }

    private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {}


}