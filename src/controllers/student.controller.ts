import { Request, Response, NextFunction } from 'express';
import { customAlphabet } from 'nanoid';

import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';
import { studentSchema, studentLoginSchema, studentUpdateSchema, studentChangePasswordSchema, studentResetPasswordSchema } from '../validations/student.validationa';
import authService from '../services/auth.service';
import BaseController from './base.controller';
import ValidationsHolder from '../validations/validationHolder';
import validationMiddleware from '../middlewares/validation.middleware';
import { constents } from '../configs/constents.config';
import CryptoJS from 'crypto-js';
import { Op } from 'sequelize';
import { badRequest, locked, notFound } from 'boom';
import { user } from '../models/user.model';
import { team } from '../models/team.model';

export default class StudentController extends BaseController {
    model = "student";
    authService: authService = new authService;
    private password = process.env.GLOBAL_PASSWORD;
    private nanoid = customAlphabet('0123456789', 6);

    protected initializePath(): void {
        this.path = '/students';
    }
    protected initializeValidations(): void {
        this.validations = new ValidationsHolder(studentSchema, studentUpdateSchema);
    }
    protected initializeRoutes(): void {
        //example route to add
        //this.router.get(`${this.path}/`, this.getData);
        this.router.post(`${this.path}/register`, this.register.bind(this));
        this.router.post(`${this.path}/login`, validationMiddleware(studentLoginSchema), this.login.bind(this));
        this.router.get(`${this.path}/logout`, this.logout.bind(this));
        this.router.put(`${this.path}/changePassword`, validationMiddleware(studentChangePasswordSchema), this.changePassword.bind(this));
        // this.router.put(`${this.path}/updatePassword`, validationMiddleware(studentChangePasswordSchema), this.updatePassword.bind(this));
        this.router.post(`${this.path}/resetPassword`, validationMiddleware(studentResetPasswordSchema), this.resetPassword.bind(this));
        super.initializeRoutes();
    }
    private HashPassword(value: any): any {
        const key = CryptoJS.enc.Hex.parse('253D3FB468A0E24677C28A624BE0F939');
        const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
        const hashedPassword = CryptoJS.AES.encrypt(value, key, {
            iv: iv,
            padding: CryptoJS.pad.NoPadding
        }).toString();
        return hashedPassword;
    }
    private async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { team_id } = req.body;
        const generatedUUID = this.nanoid();
        const hashedPassword = this.HashPassword(generatedUUID);
        let trimmedTeamName: any;
        let trimmedStudentName: any;
        trimmedStudentName = req.body.full_name.replace(/[\n\r\s\t]+/g, '').toLowerCase();
        if (!req.body.role || req.body.role !== 'STUDENT') {
            return res.status(406).send(dispatcher(res, null, 'error', speeches.USER_ROLE_REQUIRED, 406));
        }
        if (!req.body.team_id) {
            return res.status(406).send(dispatcher(res, null, 'error', speeches.USER_TEAMID_REQUIRED, 406));
        }
        const teamDetails = await this.authService.crudService.findOne(team, { where: { team_id } });
        if (!teamDetails) {
            return res.status(406).send(dispatcher(res, null, 'error', speeches.TEAM_NOT_FOUND, 406));
        } else {
            trimmedTeamName = teamDetails.dataValues.team_name.replace(/[\n\r\s\t\_]+/g, '').toLowerCase();
        }
        // console.log(trimmedTeamName, trimmedStudentName);
        if (!req.body.username || req.body.username === "") {
            req.body.username = trimmedTeamName + '_' + trimmedStudentName
            req.body['UUID'] = generatedUUID;
            req.body.qualification = hashedPassword
        }
        if (!req.body.password || req.body.password === "") req.body.password = hashedPassword;
        console.log(hashedPassword);
        const result = await this.authService.register(req.body);
        if (result.user_res) return res.status(406).send(dispatcher(res, result.user_res.dataValues, 'error', speeches.STUDENT_EXISTS, 406));
        // result.profile.dataValues['password'] = generatedUUID;
        return res.status(201).send(dispatcher(res, result.profile.dataValues, 'success', speeches.USER_REGISTERED_SUCCESSFULLY, 201));
    }
    private async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        req.body['role'] = 'STUDENT'
        try {
            const result = await this.authService.login(req.body);
            if (!result) throw notFound(speeches.USER_NOT_FOUND);
            else if (result.error) throw result.error;
            else if (!result.data || !result.data.student || !result.data.student.dataValues) throw locked(speeches.STUDENT_DETAILS_NOT_FOUND)
            let teamDetails = await this.authService.crudService.findOne(team, { where: { team_id: result.data.student.dataValues.team_id } });
            if (!teamDetails || teamDetails instanceof Error) throw teamDetails;
            result.data['team_id'] = result.data.student.dataValues.team_id;
            result.data['student_id'] = result.data.student.dataValues.student_id;
            result.data['mentor_id'] = teamDetails.dataValues.mentor_id;
            result.data['team_name'] = teamDetails.dataValues.team_name;
            delete result.data.student;
            delete result.data.evaluater;
            delete result.data.admin;
            delete result.data.mentor;
            return res.status(200).send(dispatcher(res, result.data, 'success', speeches.USER_LOGIN_SUCCESS));
    } catch(error) {
        next(error)
    }
}
    private async logout(req: Request, res: Response, next: NextFunction): Promise < Response | void> {
    const result = await this.authService.logout(req.body, res);
    if(result.error) {
    next(result.error);
} else {
    return res.status(200).send(dispatcher(res, speeches.LOGOUT_SUCCESS, 'success'));
}
    }
    private async changePassword(req: Request, res: Response, next: NextFunction): Promise < Response | void> {
    const result = await this.authService.changePassword(req.body, res);
    if(!result) {
        return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_NOT_FOUND));
    } else if(result.error) {
    return res.status(404).send(dispatcher(res, result.error, 'error', result.error));
}
        else if (result.match) {
    return res.status(404).send(dispatcher(res, null, 'error', speeches.USER_PASSWORD));
} else {
    return res.status(202).send(dispatcher(res, result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
}
    }
    private async resetPassword(req: Request, res: Response, next: NextFunction): Promise < Response | void> {
    // accept the user_id or user_name from the req.body and update the password in the user table
    const generatedUUID = this.nanoid()
        req.body['generatedPassword'] = generatedUUID;
    const result = await this.authService.restPassword(req.body, res);
    if(!result) {
        return res.status(404).send(dispatcher(res, result.user_res, 'error', speeches.USER_NOT_FOUND));
    } else if(result.match) {
    return res.status(404).send(dispatcher(res, result.match, 'error', speeches.USER_PASSWORD));
} else {
    return res.status(202).send(dispatcher(res, result, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
}
    }
    protected async getData(req: Request, res: Response, next: NextFunction): Promise < Response | void> {
    try {
        let data: any;
        const { model, id } = req.params;
        const paramStatus: any = req.query;
        if(model) {
            this.model = model;
        };
        // pagination
        const { page, size, adult } = req.query;
        let condition = adult ? { UUID: null } : { UUID: { [Op.like]: `%%` } };
        const { limit, offset } = this.getPagination(page, size);
        const modelClass = await this.loadModel(model).catch(error => {
            next(error)
        });
        const where: any = {};
        let whereClauseStatusPart: any = {};
        if(paramStatus && (paramStatus in constents.common_status_flags.list)) {
    whereClauseStatusPart = { "status": paramStatus }
}
if (id) {
    where[`${this.model}_id`] = req.params.id;
    data = await this.crudService.findOne(modelClass, {
        where: {
            [Op.and]: [
                whereClauseStatusPart,
                where,
            ]
        }
    });
} else {
    try {
        const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
            where: {
                [Op.and]: [
                    whereClauseStatusPart,
                    condition
                ]
            }, limit, offset
        })
        const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
        data = result;
    } catch (error: any) {
        return res.status(500).send(dispatcher(res, data, 'error'))
    }

}
// if (!data) {
//     return res.status(404).send(dispatcher(res,data, 'error'));
// }
if (!data || data instanceof Error) {
    if (data != null) {
        throw notFound(data.message)
    } else {
        throw notFound()
    }
    res.status(200).send(dispatcher(res, null, "error", speeches.DATA_NOT_FOUND));
    // if(data!=null){
    //     throw 
    (data.message)
    // }else{
    //     throw notFound()
    // }
}

return res.status(200).send(dispatcher(res, data, 'success'));
        } catch (error) {
    next(error);
}
    }
    protected async updateData(req: Request, res: Response, next: NextFunction): Promise < Response | void> {
    try {
        const { model, id } = req.params;
        if(model) {
            this.model = model;
        };
        const user_id = res.locals.user_id
            const where: any = {};
        let trimmedTeamName: any;
        let trimmedStudentName: any;
        trimmedStudentName = req.body.full_name.replace(/[\n\r\s\t]+/g, '').toLowerCase();
        const teamDetails = await this.authService.crudService.findOne(team, { where: { team_id: req.body.team_id } });
        if(!teamDetails) {
            return res.status(406).send(dispatcher(res, null, 'error', speeches.TEAM_NOT_FOUND, 406));
        } else {
            trimmedTeamName = teamDetails.dataValues.team_name.replace(/[\n\r\s\t\_]+/g, '').toLowerCase();
        }
            where[`${this.model}_id`] = req.params.id;
        const modelLoaded = await this.loadModel(model);
        const payload = this.autoFillTrackingColumns(req, res, modelLoaded);
        const student_data = await this.crudService.update(modelLoaded, payload, { where: where });
        const studentDetails = await this.crudService.findOne(modelLoaded, { where });
        if(!studentDetails) {
            throw badRequest()
        }
            if(studentDetails instanceof Error) {
    throw studentDetails;
}
const user_data = await this.crudService.update(user, {
    full_name: payload.full_name,
    username: trimmedTeamName + '_' + trimmedStudentName
}, { where: { user_id: studentDetails.dataValues.user_id } });
if (!student_data || !user_data) {
    throw badRequest()
}
if (student_data instanceof Error) {
    throw student_data;
}
if (user_data instanceof Error) {
    throw user_data;
}
return res.status(200).send(dispatcher(res, student_data, 'updated'));
        } catch (error) {
    next(error);
}
    }
}
        // private async updatePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        //     const result = await this.authService.updatePassword(req.body, res);
        //     if (!result) {
        //         return res.status(404).send(dispatcher(res,null, 'error', speeches.USER_NOT_FOUND));
        //     } else if (result.error) {
        //         return res.status(404).send(dispatcher(res,result.error, 'error', result.error));
        //     }
        //     else if (result.match) {
        //         return res.status(404).send(dispatcher(res,null, 'error', speeches.USER_PASSWORD));
        //     } else {
        //         return res.status(202).send(dispatcher(res,result.data, 'accepted', speeches.USER_PASSWORD_CHANGE, 202));
        //     }
        // }