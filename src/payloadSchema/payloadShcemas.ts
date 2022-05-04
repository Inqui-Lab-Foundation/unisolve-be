/*Importing the dependencies*/
import { object, string, number } from "zod";

export const studentPasswordSchema = object({
    body: object({
        userId: string({ required_error: 'studentId is required field' }),
        oldPassword: string({
            required_error: 'Password is required field'
        }).min(6, 'Password should be minimum of 6 characters'),
        newPassword: string({
            required_error: 'Password is required field'
        }).min(6, 'Password should be minimum of 6 characters')
    })
});

export const studentLoginSchema = object({
    body: object({
        email: string().email('not a valid email'),
        password: string({ required_error: 'Password is required field' }).min(6, 'Password should be minimum of 6 characters'),
    })
});

export const studentRegisterSchema = object({
    body: object({
        student_name: string({
            required_error: 'Name is required field'
        }),
        password: string({
            required_error: 'Password is required field'
        }).min(6, 'Password should be minimum of 6 characters'),
        email: string({ required_error: 'Email is required field' }).email('not a valid email'),
        date_of_birth: string({ required_error: 'required field' }).min(9, "Enter the right format DOB"),
        mobile: number({ required_error: 'required field' }).min(10, "Enter the right format mobile number"),
        institute_name: string({ required_error: 'required field' })
    })
});