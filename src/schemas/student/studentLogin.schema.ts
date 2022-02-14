/*Importing the dependencies*/
import { object, string, TypeOf } from "zod";
import { Omit } from 'lodash';

export const userLoginSchema = object({
    body: object({
        password: string({
            required_error: 'Password is required field'
        }).min(6, 'Password should be minimum of 6 characters'),
        passwordConfirmation: string({
            required_error: 'Password is required field'
        }).min(6, 'Password should be minimum of 6 characters'),
        email: string({ required_error: 'Email is required field' }).email('not a valid email')
    }).refine((data: any) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]
    })
});