/*Importing the dependencies*/
import { object, string, TypeOf } from "zod";
import { Omit } from 'lodash';

export const userPasswordSchema = object({
    body: object({
        email: string({ required_error: 'Email is required field' }).email('not a valid email'),
        newPassword: string({
            required_error: 'Password is required field'
        }).min(6, 'Password should be minimum of 6 characters'),
        passwordConfirmation: string({
            required_error: 'Password is required field'
        }).min(6, 'Password should be minimum of 6 characters'),
    }).refine((data: any) => data.newPassword === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]
    })
});

export type CreateUserPassword = Omit<TypeOf<typeof userPasswordSchema>, "body.passwordConfirmation">;
