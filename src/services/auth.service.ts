import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';

import jwtUtil from '../utils/jwt.util';
import CRUDService from "./crud.service";
import { baseConfig } from '../configs/base.config';
import { speeches } from '../configs/speeches.config';
import { admin } from "../models/admin.model";
import { evaluater } from "../models/evaluater.model";
import { mentor } from "../models/mentor.model";
import { organization } from '../models/organization.model';
import { student } from "../models/student.model";
import { user } from "../models/user.model";
import { team } from '../models/team.model';
import axios from 'axios';
export default class authService {

    crudService: CRUDService = new CRUDService;
    private password = process.env.GLOBAL_PASSWORD;

    async checkOrgDetails(organization_code: any) {
        try {
            const org = await this.crudService.findOne(organization, { where: { organization_code } })
            return org;
        } catch (error) {
            return error;
        }
    }
    async getServiceDetails(service: string, query_parameter: any) {
        let model: any;
        switch (service) {
            case 'student':
                model = student;
                break
            case 'team':
                model = team;
                break;
            default: model = null;
        }
        try {
            const details = await this.crudService.findOne(model, { where: query_parameter })
            if (details instanceof Error) {
                return 'not'
            } return details;
        } catch (error) {
            return error;
        }
    }
    async register(requestBody: any) {
        let response: any = {};
        let profile: any;
        let reg_statue: any = requestBody.reg_statue;
        try {
            const user_res = await this.crudService.findOne(user, { where: { username: requestBody.username } });
            if (user_res) {
                response['user_res'] = user_res;
                return response
            }
            const result = await this.crudService.create(user, requestBody);
            let whereClass = { ...requestBody, user_id: result.dataValues.user_id };
            console.log(whereClass);
            switch (requestBody.role) {
                case 'STUDENT': {
                    profile = await this.crudService.create(student, whereClass);
                    break;
                }
                case 'MENTOR': {
                    if (requestBody.organization_code) {
                        profile = await this.crudService.create(mentor, whereClass);
                        profile.dataValues['username'] = result.dataValues.username
                        break;
                    } else return false;
                }
                case 'EVALUATER': {
                    profile = await this.crudService.create(evaluater, whereClass);
                    break;
                }
                case 'ADMIN':
                    profile = await this.crudService.create(admin, whereClass);
                    break;
                default:
                    profile = null;
            }
            response['profile'] = profile;
            return response;
        } catch (error: any) {
            response['error'] = error;
            return response
        }
    }
    async login(requestBody: any) {
        const result: any = {};
        try {
            const user_res: any = await this.crudService.findOne(user, {
                where: {
                    username: requestBody.username,
                    password: await bcrypt.hashSync(requestBody.password, process.env.SALT || baseConfig.SALT),
                    role: requestBody.role
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
                result['error'] = speeches.USER_NOT_FOUND;
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
    async generateOtp() {
        return Math.random().toFixed(6).substr(-6);
    }
    async triggerOtpMsg(mobile: any, otp: any) {
        try {
            const resp = await axios.get(`https://veup.versatilesmshub.com/api/sendsms.php?api=0a227d90ef8cd9f7b2361b33abb3f2c8&senderid=YFSITS&channel=Trans&DCS=0&flashsms=0&number=${mobile}&text=Dear Student, A request for password reset had been generated. Your OTP for the same is ${otp} -Team Youth for Social Impact&SmsCampaignId=1&EntityID=1701164847193907676&DLT_TE_ID=1507165035646232522`)
            // console.log(resp)
            return resp;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
    async verifyUser(requestBody: any, responseBody: any) {
        let result: any = {};
        try {
            const user_res: any = await this.crudService.findOne(mentor, {
                where: {
                    [Op.or]: [
                        // {
                        //     email: { [Op.eq]: requestBody.email }
                        // },
                        {
                            mobile: { [Op.like]: `%${requestBody.mobile}%` }
                        }
                    ]
                }
            });

            if (!user_res) {
                result['user_res'] = user_res;
                result['error'] = speeches.USER_NOT_FOUND;
                return result;
            }
            //TODO trigger otp and update user with otp
            const otp = await this.generateOtp();

            const smsResponse = await this.triggerOtpMsg(requestBody.mobile, otp);
            if (smsResponse instanceof Error) {
                throw smsResponse;
            }

            const response = await this.crudService.update(user, {
                password: await bcrypt.hashSync(otp, process.env.SALT || baseConfig.SALT)
            }, { where: { user_id: user_res.dataValues.user_id } });
            result['data'] = response;
            return result;

        } catch (error) {
            result['error'] = error;
            return result;
        }
    }
    async mobileUpdate(requestBody: any) {
        let result: any = {};
        try {
            const mentor_res: any = await this.crudService.updateAndFind(mentor, { mobile: requestBody.mobile }, {
                where: { user_id: requestBody.user_id }
            });
            if (!mentor_res) {
                result['error'] = speeches.USER_NOT_FOUND;
                return result;
            }
            const otp = await this.generateOtp();
            const smsResponse = this.triggerOtpMsg(requestBody.mobile, otp);
            if (smsResponse instanceof Error) {
                throw smsResponse;
            }
            const user_res: any = await this.crudService.updateAndFind(user, {
                password: await bcrypt.hashSync(otp, process.env.SALT || baseConfig.SALT)
            }, { where: { user_id: requestBody.user_id } })
            // await this.crudService.update(user, { password: otp }, { where: { user_id: user_res.dataValues.user_id } });
            // await this.crudService.update(mentor, { mobile: requestBody.mobile }, { where: { user_id: user_res.dataValues.user_id } });
            result['data'] = {
                username: user_res.dataValues.username,
                user_id: user_res.dataValues.user_id,
                mobile: mentor_res.dataValues.mobile,
                reg_status: mentor_res.dataValues.reg_status,
                otp
            };
            return result;
        } catch (error) {
            result['error'] = error;
            return result;
        }
    }
    async updatePassword(requestBody: any, responseBody: any) {
        const res = await this.changePassword(requestBody, responseBody);
        console.log(res);
        if (res.data) {
            await this.crudService.update(mentor, { reg_status: '3' }, { where: { user_id: requestBody.user_id } });
        } return res;
    }
    async validatedOTP(requestBody: any) {
        const user_res: any = await this.crudService.findOnePassword(user, { where: { user_id: requestBody.user_id } })
        const res = bcrypt.compareSync(requestBody.otp, user_res.dataValues.password);
        console.log(res);
        if (res) {
            await this.crudService.update(mentor, { reg_status: '2' }, { where: { user_id: requestBody.user_id } })
            return res;
        } return res;
    }
    async restPassword(requestBody: any, responseBody: any) {
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
            const response = await this.crudService.update(user, {
                password: await bcrypt.hashSync(requestBody.generatedPassword, process.env.SALT || baseConfig.SALT)
            }, { where: { user_id: user_res.dataValues.user_id } });
            result = { data: response, password: requestBody.generatedPassword };
            return result;
        } catch (error) {
            result['error'] = error;
            return result;
        }
    }
}
