import { v4 as UUIDV4 } from 'uuid'
import { omit, Omit } from "lodash";

import { correctPassword } from "@src/models/student.model";
import { student } from "@src/models/student.model";

class studentService {
    async buildStudent(input: any) {
        const id = UUIDV4();
        try {
            const newEntry = await student.create({ ...input, id });
            return omit(newEntry.toJSON(), "password")
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    async authenticateStudent({ email, password }: { email: string, password: string }) {
        const findEntry = await student.findOne({ where: { email } });
        const foundStudentDetails = findEntry?.toJSON();
        if (!foundStudentDetails) return false;
        const authenticate = correctPassword(password, foundStudentDetails.password);
        if (!authenticate) return false;
        return omit(foundStudentDetails, 'password')
    }
};


/**
 * export async function validatePassword({ email, password }: { email: string, password: string }) {
    const user = await userModel.findOne({ email });
    if (!user) return false;
    const isValid = await user.comparePassword(password);
    if (!isValid) return false;
    return omit(user, 'password');
}
 */



export default new studentService();