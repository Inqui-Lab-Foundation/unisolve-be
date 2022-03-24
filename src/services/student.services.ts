import { v4 as UUIDV4 } from 'uuid'
import { find, omit, Omit } from "lodash";
import bcrypt from 'bcrypt';

import { student } from "../models/student.model";
import dbService from './database.services'
import logger from '../utils/logger'

/**
 * service for all the student controllers logic isolated
 */
class studentService {
    /**
     * 
     * @param input as request body from the express application
     * @returns object after create the entry in database
     */
    buildStudent(data: object) {
        const id = UUIDV4(); // generate new UUID
        try {
            const newEntry = dbService.buildFunction(student, { id, ...data });
            return omit(newEntry, "password");
        } catch (error: any) {
            logger.error(error.message);
            return error.message;
        }
    };
    /**
     * 
     * @param input as request body from the express application
     * @returns object with query result 
     */
    findStudent(email: string) {
        if (email) {
            const result = dbService.findOneFunction(student, { where: { email } });
            return result;
        }
        logger.error('please check your emailId');
        throw new Error('please check your emailId ');
    };
    /**
     * 
     * @param param0 email and password as strings
     * @returns student details post verifying the password with actual password 
     */
    async authenticateStudent(email: string, password: string) {
        const findEntry = await this.findStudent(email);
        if (!findEntry) {
            logger.error(`Can't find student details`);
            return false;
        }
        const authenticate = dbService.correctPassword(password, findEntry.password);
        if (!authenticate) {
            logger.error(`Can't validate the password please check and try again`)
            return false;
        }
        return omit(omit(findEntry.dataValues, 'password'));
    };
    /**
     * 
     * @param input as request body from the express application
     * @returns user details object post changing the password
     */
    async changePassword(input: any) {
        const { userId, oldPassword, newPassword } = input;
        const findEntry = await dbService.findByPkFunction(student, userId);
        if (findEntry) {
            const authenticate = dbService.correctPassword(oldPassword, findEntry.getDataValue('password'));
            if (!authenticate) {
                logger.error(`something went wrong while updating the password`)
                return { message: "something went wrong while updating the password" }
            }
            findEntry.setDataValue('password', newPassword);
            findEntry.save();
            logger.info(`Password update successfully ${JSON.stringify(findEntry)}`)
            return findEntry.dataValues;
        }
    };
};

export default new studentService();