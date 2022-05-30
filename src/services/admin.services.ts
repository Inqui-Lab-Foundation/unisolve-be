import { omit } from "lodash";

import { user } from "../models/user.model";
import OperationalService from './operational.services'
import logger from '../utils/logger'

// student Service object
class adminService {
    //create the new student parameters req.body object
    async build(data: object) {
        try {
            const created = await OperationalService.build(user, { ...data });
            logger.info(`new account created ${JSON.stringify(created)}`);
            return omit(created.dataValues, "password"); // remove the password before sending to the returning
        } catch (error: any) {
            logger.error(error.message);
            return false;
        }
    };
    //finding the student parameter query object
    async find(query: object) {
        try {
            const result = await OperationalService.findOne(user, query);
            logger.info(`Account found ${JSON.stringify(result.dataValues)}`)
            return result.dataValues;
        } catch (error: any) {
            logger.error(`Error found ${error.message}`);
            return false;
        }
    };
    // change the student password
    async changePassword(input: any) {
        const { id, oldPassword, newPassword } = input;
        const found = await OperationalService.findByPk(user, id);
        console.log(found, input);
        if (found === null) {
            logger.error(`student not found ${found}`)
        } else if (oldPassword !== found.getDataValue('password')) {
            logger.error(`password not validate`)
            return ("password not validate")
        } else {
            found.setDataValue('password', newPassword);
            found.save();
            logger.info(`Password update successfully ${JSON.stringify(oldPassword, found)}`)
            return found.dataValues;
        }
    };
};

export default new adminService();
