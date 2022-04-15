import { v4 as UUIDV4 } from 'uuid'
import { omit } from "lodash";

import { student } from "../models/student.model";
import OperationalService from './operational.services'
import logger from '../utils/logger'

// Student Service object
class studentService {
    //create the new user parameters req.body object
    async buildStudent(data: object) {
        const id = UUIDV4(); // generate new UUID
        try {
            const newEntry = await OperationalService.build(student, { id, ...data });
            // remove the password before sending to the returning
            return omit(newEntry.dataValues, "password");
        } catch (error: any) {
            logger.error(error.message);
            return error.message;
        }
    };
    //finding the user parameter query object
    findStudent(query: object) {
        if (!query) {
            logger.error('please provide the query');
            return new Error('please provide the query');
        }
        return OperationalService.findOne(student, query);;
    };
    //checking the password validation
    async authenticateStudent(password: string, oldPassword: string) {
        if (password === oldPassword) {
            return true;
        } return false;
    };
    // change the user password
    async changePassword(input: any) {
        const { userId, oldPassword, newPassword } = input;
        const findEntry = await OperationalService.findByPk(student, userId);
        if (findEntry) {
            const authenticate = await this.authenticateStudent(oldPassword, findEntry.getDataValue('password'));
            if (authenticate === false) {
                logger.error(`password not validate`)
                return { error: "password not validate" }
            }
            findEntry.setDataValue('password', newPassword);
            findEntry.save();
            logger.info(`Password update successfully ${JSON.stringify(findEntry)}`)
            return findEntry.dataValues;
        } return { error: 'User not found' }
    };
};

export default new studentService();


/**
 * TODO :
 * code documenting 
 * test cases fix
 */