import { v4 as UUIDV4 } from 'uuid'
import { omit, Omit } from "lodash";
import bcrypt from 'bcrypt';

import { student } from "../models/student.model";
import dbService from './database.services'

/**
 * service for all the student controllers logic isolated
 */
class studentService {
    /**
     * 
     * @param input as request body from the express application
     * @returns object after create the entry in database
     */
    buildStudent(input: any) {
        const id = UUIDV4();
        try {
            const newEntry = dbService.buildFunction(student, { ...input, id });
            return omit(newEntry, "password");
        } catch (error: any) {
            return error.message;
        }
    };
    /**
     * 
     * @param input as request body from the express application
     * @returns object with query result 
     */
    findStudent(input: any) {
        const { email } = input;
        try {
            const result = dbService.findOneFunction(student, { where: { email } });
            return result;
        } catch (error: any) {
            return error.message
        }
    };
    /**
     * 
     * @param param0 email and password as strings
     * @returns student details post verifying the password with actual password 
     */
    async authenticateStudent({ email, password }: { email: string, password: string }) {
        const findEntry = await dbService.findOneFunction(student, { where: { email } });
        if (!findEntry) return false;
        const authenticate = dbService.correctPassword(password, findEntry.password);
        if (!authenticate) return false;
        return omit(findEntry, 'password')
    };
    /**
     * 
     * @param input as request body from the express application
     * @returns user details object post changing the password
     */
    async changePassword(input: any) {
        const { email, newPassword } = input;
        await dbService.findOneFunction(student, { where: { email } }).then(user => {
            const currentPassword = user?.getDataValue("password");
            if (currentPassword) {
                const salt = bcrypt.genSaltSync(10, 'a');
                const hashPassword = bcrypt.hashSync(newPassword, salt)
                user?.setDataValue('password', hashPassword)
                user?.save()
                return user?.toJSON()
            } else {
                return { message: "something went wrong while updating the password" }
            }
        })
    };
};

export default new studentService();