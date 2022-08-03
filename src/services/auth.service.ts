import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';

import { baseConfig } from '../configs/base.config';
import { speeches } from '../configs/speeches.config';
import { admin } from "../models/admin.model";
import { evaluater } from "../models/evaluater.model";
import { mentor } from "../models/mentor.model";
import { organization } from '../models/organization.model';
import { student } from "../models/student.model";
import { user } from "../models/user.model";
import jwtUtil from '../utils/jwt.util';
import CRUDService from "./crud.service";

export default class authService {
    crudService: CRUDService = new CRUDService;
    private password = process.env.GLOBAL_PASSWORD;

    async checkOrgDetails(organization_code: any) {
        try {
            // console.log(organization_code)
            const org = await this.crudService.findOne(organization, { where: { organization_code } })
            return org;
        } catch (error) {
            return error;
        }
    }
    async register(requestBody: any) {
        try {
            const user_res = await this.crudService.findOne(user, { where: { username: requestBody.username } });
            if (user_res) {
                return false;
            }
            // requestBody.password = await bcrypt.hashSync(requestBody.password, process.env.SALT || baseConfig.SALT)
            const result = await this.crudService.create(user, requestBody);
            let Profile: any;
            const whereClass = { ...requestBody, user_id: result.dataValues.user_id }
            switch (requestBody.role) {
                case 'STUDENT': {
                    if (!whereClass.UUID) {
                        whereClass.UUID = nanoid(6).toUpperCase()
                    }
                    Profile = await this.crudService.create(student, whereClass);
                    break;
                }
                case 'MENTOR': {
                    if (requestBody.organization_code) {
                        Profile = await this.crudService.create(mentor, whereClass);
                        break;
                    } else return false;
                }
                case 'EVALUATER': {
                    Profile = await this.crudService.create(evaluater, whereClass);
                    break;
                }
                default:
                    Profile = await this.crudService.create(admin, whereClass);
            }
            return Profile;
        } catch (error) {
            return error;
        }
    }

    async login(requestBody: any) {
        const result: any = {};
        try {
            const user_res: any = await this.crudService.findOne(user, {
                where: {
                    username: requestBody.username,
                    password: await bcrypt.hashSync(requestBody.password, process.env.SALT || baseConfig.SALT)
                }
            });
            if (!user_res) {
                return false;
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
                    result['error'] = error_message;
                    return result;
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
                result['data'] = {
                    user_id: user_res.dataValues.user_id,
                    name: user_res.dataValues.username,
                    full_name: user_res.dataValues.full_name,
                    status: user_res.dataValues.status,
                    role: user_res.dataValues.role,
                    token,
                    type: 'Bearer',
                    expire: process.env.TOKEN_DEFAULT_TIMEOUT
                }
                return result
            }
        } catch (error) {
            result['error'] = error;
            return result;
        }
    }

    async logout(requestBody: any, responseBody: any) {
        let result: any = {};
        try {
            const update_res = await this.crudService.update(user,
                { is_loggedin: "NO" },
                { where: { user_id: responseBody.locals.user_id } }
            );
            result['data'] = update_res;
            return result;
        } catch (error) {
            result['error'] = error;
            return result;
        }
    }

    async changePassword(requestBody: any, responseBody: any) {
        let result: any = {};
        try {
            const user_res: any = await this.crudService.findOnePassword(user, {
                where: {
                    [Op.or]: [
                        {
                            username: { [Op.eq]: requestBody.username }
                        },
                        {
                            user_id: { [Op.like]: `%${requestBody.user_id}%` }
                        }
                    ]
                }
            });
            if (!user_res) {
                result['user_res'] = user_res;
                return result;
            }
            //comparing the password with hash
            const match = bcrypt.compareSync(requestBody.old_password, user_res.dataValues.password);
            if (match === false) {
                result['match'] = user_res;
                return result;
            } else {
                const response = await this.crudService.update(user, {
                    password: await bcrypt.hashSync(requestBody.new_password, process.env.SALT || baseConfig.SALT)
                }, { where: { user_id: user_res.dataValues.user_id } });
                result['data'] = response;
                return result;
            }
        } catch (error) {
            result['error'] = error;
            return result;
        }
    }
}
