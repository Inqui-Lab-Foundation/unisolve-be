import { v4 as UUIDV4 } from 'uuid'
import { omit, Omit } from "lodash";
import bcrypt from 'bcrypt';

import { correctPassword } from "../models/student.model";
import { student } from "../models/student.model";

/**
 * service for all the student controllers logic isolated
 */
class studentService {
    /**
     * 
     * @param input as request body from the express application
     * @returns object after create the entry in database
     */
    async buildStudent(input: any) {
        const id = UUIDV4();
        try {
            const newEntry = await student.create({ ...input, id });
            return omit(newEntry.toJSON(), "password")
        } catch (error: any) {
            throw new Error(error.message)
        }
    };
    /**
     * 
     * @param input as request body from the express application
     * @returns object with query result 
     */
    async findStudent(input: any) {
        const { email } = input;
        try {
            const result = await student.findOne({ where: { email } });
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
        const findEntry = await student.findOne({ where: { email } });
        const foundStudentDetails = findEntry?.toJSON();
        if (!foundStudentDetails) return false;
        const authenticate = correctPassword(password, foundStudentDetails.password);
        if (!authenticate) return false;
        return omit(foundStudentDetails, 'password')
    };
    /**
     * 
     * @param input as request body from the express application
     * @returns user details object post changing the password
     */
    async changePassword(input: any) {
        const { email, newPassword } = input;
        await student.findOne({ where: { email } }).then(user => {
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