import { v4 as UUIDV4 } from 'uuid'
import { omit } from "lodash";

import { student } from "../models/student.model";
import OperationalService from './operational.services'
import logger from '../utils/logger'

// student Service object
class studentService {
    //create the new student parameters req.body object
    async buildStudent(data: object) {
        const id = UUIDV4(); // generate new UUID
        try {
            const created = await OperationalService.build(student, { id, ...data });
            logger.info(`new account created ${JSON.stringify(created)}`);
            return omit(created.dataValues, "password"); // remove the password before sending to the returning
        } catch (error: any) {
            logger.error(error.message);
            return false;
        }
    };
    //finding the student parameter query object
    async findStudent(query: object) {
        try {
            const result = await OperationalService.findOne(student, query);
            logger.info(`Account found ${JSON.stringify(result.dataValues)}`)
            return result.dataValues;
        } catch (error: any) {
            logger.error(`Error found ${error.message}`);
            return false;
        }
    };
    // change the student password
    async changePassword(input: any) {
        const { userId, oldPassword, newPassword } = input;
        const foundStudent = await OperationalService.findByPk(student, userId);
        if (!foundStudent) {
            logger.error(`student not found`)
            throw new Error('student not found');
        }
        if (oldPassword !== foundStudent.getDataValue('password')) {
            logger.error(`password not validate`)
            throw new Error("password not validate")
        }
        foundStudent.setDataValue('password', newPassword);
        foundStudent.save();
        logger.info(`Password update successfully ${JSON.stringify(oldPassword, foundStudent)}`)
        return foundStudent.dataValues;
    };
};

export default new studentService();
