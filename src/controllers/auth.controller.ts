import e, { Router, Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import * as csv from "fast-csv";
import fs from 'fs';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import IController from '../interfaces/controller.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import authValidations from '../validations/auth.validations';
import dynamicForm from '../configs/dynamicForm';
import CRUDService from '../services/crud.service';
import jwtUtil from '../utils/jwt.util';
import { user } from '../models/user.model';
import dispatcher from '../utils/dispatch.util';
import { speeches } from '../configs/speeches.config';
import { baseConfig } from '../configs/base.config';
import sendNotification from '../utils/notification.util';
import { constents } from '../configs/constents.config';
import { admin } from '../models/admin.model';
import { mentor } from '../models/mentor.model';
import { student } from '../models/student.model';
import { evaluater } from '../models/evaluater.model';
import { badRequest } from 'boom';
import { organization } from '../models/organization.model';

export default class AuthController implements IController {
    public path: string;
    public router: Router;
    crudService: CRUDService = new CRUDService;
    public userModel: any = new user();
    private password = process.env.GLOBAL_PASSWORD;

    constructor() {
        this.path = '/auth';
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.post(`${this.path}/login`, this.login);
        this.router.get(`${this.path}/logout`, this.logout);
        this.router.post(`${this.path}/register`, this.register);
        this.router.put(`${this.path}/changePassword`, validationMiddleware(authValidations.changePassword), this.changePassword);
        this.router.post(`${this.path}/dynamicSignupForm`, validationMiddleware(authValidations.dynamicForm), this.dynamicSignupForm);
        this.router.get(`${this.path}/dynamicSignupForm`, this.getSignUpConfig);
        this.router.post(`${this.path}/:model/bulkUpload`, this.bulkUpload.bind(this))
    }

    private loadModel = async (model: string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${model}.model`);
        return modelClass[model];
    }
    protected async autoFillUserData(req: Request, res: Response, modelLoaded: any, reqData: any = null) {
        let payload = reqData;
        if (modelLoaded.rawAttributes.user_id !== undefined) {
            const userData = await this.crudService.create(user, reqData);
            payload['user_id'] = userData.dataValues.user_id;
        }
        if (modelLoaded.rawAttributes.created_by !== undefined) {
            payload['created_by'] = res.locals.user_id;
        }
        if (modelLoaded.rawAttributes.updated_by !== undefined) {
            payload['updated_by'] = res.locals.user_id;
        }
        return payload;
    }

    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user_res: any = await this.crudService.findOne(user, {
                where: {
                    username: req.body.username,
                    password: await bcrypt.hashSync(req.body.password, process.env.SALT || baseConfig.SALT)
                }
            });
            if (!user_res) {
                return res.status(404).send(dispatcher(user_res, 'error', speeches.USER_NOT_FOUND));
            } else {
                // user status checking
                let stop_procedure: boolean = false;
                let error_message: string = '';
                switch (user_res.status) {
                    case 'DELETED':
                        stop_procedure = true;
                        error_message = speeches.USER_DELETED;
                    case 'LOCKED':
                        stop_procedure = true;
                        error_message = speeches.USER_LOCKED;
                    case 'INACTIVE':
                        stop_procedure = true;
                        error_message = speeches.USER_INACTIVE
                }
                if (stop_procedure) {
                    return res.status(401).send(dispatcher(error_message, 'error', speeches.USER_RISTRICTED, 401));
                }
                await this.crudService.update(user, {
                    is_loggedin: "YES",
                    last_login: new Date().toLocaleString()
                }, { where: { user_id: user_res.user_id } });

                user_res.is_loggedin = "YES";
                const token = await jwtUtil.createToken(user_res.dataValues, `${process.env.PRIVATE_KEY}`);

                // await sendNotification({
                //     notification_type: constents.notification_types.list.PUSH,
                //     target_audience: user_res.user_id, // Keep 'ALL' for all users
                //     title: 'Login Successful',
                //     image: '',
                //     message: 'You have successfully logged in.',
                //     status: constents.notification_status_flags.list.PUBLISHED,
                //     created_by: user_res.user_id
                // });

                // await sendNotification({
                //     notification_type: constents.notification_types.list.EMAIL,
                //     target_audience: user_res.email, // Keep 'ALL' for all users
                //     title: 'Login Successful',
                //     image: '',
                //     message: 'You have successfully logged in.',
                //     status: constents.notification_status_flags.list.PUBLISHED,
                //     created_by: user_res.user_id
                // });
                return res.status(200).send(dispatcher({
                    user_id: user_res.dataValues.user_id,
                    name: user_res.dataValues.username,
                    full_name: user_res.dataValues.full_name,
                    status: user_res.dataValues.status,
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
                where: { username: req.body.username }
            });
            if (user_res) return res.status(406).send(dispatcher(speeches.USER_ALREADY_EXISTED, 'error', speeches.NOT_ACCEPTABLE, 406));
            const result = await this.crudService.create(user, req.body);
            // user role checking
            let profile: any;
            const whereClass = { ...req.body, user_id: result.dataValues.user_id }
            switch (req.body.role) {
                case 'STUDENT': {
                    profile = await this.crudService.create(student, whereClass);
                    break;
                }
                case 'MENTOR': {
                    if (req.body.org_code) {
                        profile = await this.crudService.create(mentor, whereClass);
                        break;
                    } else { res.status(400).send({ messene: 'error' }) }
                }
                case 'EVALUATER': {
                    profile = await this.crudService.create(evaluater, whereClass);
                    break;
                }
                default:
                    profile = await this.crudService.create(admin, whereClass);
            }
            return res.status(201).send(dispatcher(result, 'success', speeches.USER_REGISTERED_SUCCESSFULLY, 201));
        } catch (error) {
            next(error);
        }
    }

    private changePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user_res: any = await this.crudService.findOnePassword(user, {
                where: {
                    [Op.or]: [
                        {
                            username: { [Op.eq]: req.body.username }
                        },
                        {
                            user_id: { [Op.like]: `%${req.body.user_id}%` }
                        }
                    ]
                }
            });
            if (!user_res) {
                return res.status(404).send(dispatcher(user_res, 'error', speeches.USER_NOT_FOUND));
            }
            //comparing the password with hash
            const match = bcrypt.compareSync(req.body.old_password, user_res.dataValues.password);
            if (match === false) {
                return res.status(404).send(dispatcher(user_res, 'error', speeches.USER_PASSWORD));
            } else {
                const result = await this.crudService.update(user, {
                    password: await bcrypt.hashSync(req.body.new_password, process.env.SALT || baseConfig.SALT)
                }, { where: { user_id: user_res.dataValues.user_id } });
                return res.status(202).send(dispatcher(result, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
            }
        } catch (error) {
            next(error);
        }
    }

    private dynamicSignupForm = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result: any = dynamicForm.getFormObject(req.body);
            if (result.length <= 0) {
                return res.status(406).send(dispatcher(speeches.FILE_EMPTY, 'error', speeches.NOT_ACCEPTABLE, 406));
            }
            writeFileSync(path.join(process.cwd(), 'resources', 'configs', 'singUp.json'), JSON.stringify(result), {
                encoding: "utf8",
                flag: "w",
                mode: 0o666
            });
            return res.status(200).send(dispatcher(result, 'success', speeches.CREATED_FILE));
        } catch (error) {
            next(error);
        }
    }

    private getSignUpConfig = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const options = {
            root: path.join(process.cwd(), 'resources', 'configs'),
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
        const filePath = path.join(process.cwd(), 'resources', 'configs', 'singUp.json');
        if (filePath === 'Error') {
            return res.status(404).send(dispatcher(speeches.FILE_EMPTY, 'error', speeches.DATA_NOT_FOUND));
        }
        const file: any = readFileSync(path.join(process.cwd(), 'resources', 'configs', 'singUp.json'), {
            encoding: 'utf8',
            flag: 'r'
        })
        return res.status(200).send(dispatcher(JSON.parse(file), 'success', speeches.FETCH_FILE))
    }

    protected async bulkUpload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        //@ts-ignore
        let file = req.files.file;
        let Errors: any = [];
        let bulkData: any = [];
        let counter: number = 0;
        let existedEntities: number = 0;
        let dataLength: number;
        let payload: any;
        const { model } = req.params;
        let loadMode: any = '';
        let role = '';

        //checking for role
        switch (model) {
            case 'student': {
                loadMode = student;
                role = 'STUDENT'
                break;
            }
            case 'evaluater': {
                loadMode = evaluater;
                role = 'EVALUATER'
                break;
            }
            case 'mentor': {
                loadMode = mentor;
                role = 'MENTOR'
                break;
            }
            default: loadMode = user;
        }

        if (file === undefined) return res.status(400).send(dispatcher(null, 'error', speeches.FILE_REQUIRED, 400));
        if (file.type !== 'text/csv') return res.status(400).send(dispatcher(null, 'error', speeches.FILE_REQUIRED, 400));
        //parsing the data
        const stream = fs.createReadStream(file.path).pipe(csv.parse({ headers: true }));
        //error event
        stream.on('error', (error) => res.status(400).send(dispatcher(error, 'error', speeches.CSV_SEND_ERROR, 400)));
        //data event;
        stream.on('data', async (data: any) => {
            dataLength = Object.entries(data).length;
            for (let i = 0; i < dataLength; i++) {
                if (Object.entries(data)[i][1] === '') {
                    Errors.push(badRequest('missing fields', data));
                    return;
                }
            }
            bulkData.push(data);
        })
        //parsing completed
        stream.on('end', async () => {
            if (Errors.length > 0) next(badRequest(Errors.message));
            for (let data = 0; data < bulkData.length; data++) {
                const match = await this.crudService.findOne(user, { where: { username: bulkData[data]['username'] } });
                if (match) {
                    existedEntities++;
                } else {
                    counter++;
                    payload = await this.autoFillUserData(req, res, loadMode, { ...bulkData[data], role, password: this.password });
                    bulkData[data] = payload;
                };
            }
            if (counter > 0) {
                await this.crudService.bulkCreate(loadMode, bulkData)
                    .then((result) => {
                        return res.send(dispatcher({ data: result, createdEntities: counter, existedEntities }, 'success', speeches.CREATED_FILE, 200));
                    }).catch((error: any) => {
                        return res.status(500).send(dispatcher(error, 'error', speeches.CSV_SEND_INTERNAL_ERROR, 500));
                    })
            } else if (existedEntities > 0) {
                return res.status(400).send(dispatcher({ createdEntities: counter, existedEntities }, 'error', speeches.CSV_DATA_EXIST, 400));
            }
        });
    }
}   