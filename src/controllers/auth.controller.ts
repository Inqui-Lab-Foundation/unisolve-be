import { Router, Request, Response, NextFunction} from 'express';
import IController from '../interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import validationMiddleware from '../middlewares/validation.middleware';
import authValidations from '../validations/auth.validations';

export default class AuthController implements IController {
    public path: string;
    public router: Router;

    constructor() {
        this.path = '/auth';
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.post(`${this.path}/login`, validationMiddleware(authValidations.login), this.login);
        this.router.post(`${this.path}/register`, validationMiddleware(authValidations.register), this.register);
    }

    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const user = req.body; //await User.findOne({ where: { email } });
            if (!user) {
                throw new HttpException(404, 'User not found');
            }
            // const isValid = await user.validatePassword(password);
            // if (!isValid) {
            //     throw new HttpException(401, 'Invalid password');
            // }
            const token = process.env.salt; //await user.generateAuthToken();
            return res.status(200).send({ user, token });
        } catch (error) {
            next(error);
        }
    }

    private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {}


}