import { v4 as UUIDV4 } from 'uuid'
import { omit } from "lodash";


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
    findStudentByEmail(email: string) {
        if (email) {
            const result = dbService.findOneFunction(student, { where: { email } });
            return result;
        }
        logger.error('please check your emailId');
        throw new Error('please check your emailId ');
    };
    findStudentByMobile(mobile: number) {
        if (mobile) {
            const result = dbService.findOneFunction(student, { where: { mobile } });
            return result;
        }
        logger.error('please check your mobile');
        throw new Error('please check your mobile');
    };
    findStudentByStudentName(student_name: string) {
        if (student_name) {
            const result = dbService.findOneFunction(student, { where: { student_name } });
            return result;
        }
        logger.error('please check your student_name');
        throw new Error('please check your student_name ');
    };
    /**
     * 
     * @param param0 email and password as strings
     * @returns student details post verifying the password with actual password 
     */
    async authenticateStudent(password: string, oldPassword: string) {
        if (password === oldPassword) {
            return true;
        } return false;
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