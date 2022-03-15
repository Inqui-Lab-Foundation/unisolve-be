/*Importing the dependencies*/
import { object, string, z, TypeOf, number } from "zod";
import { Omit } from 'lodash';

export const mentorPayload = object({
    body: object({
        mentor_name: string({
            required_error: 'Name is required field'
        }),
        email: string({ required_error: 'Email is required field' }).email('not a valid email'),
        mobile: number({ required_error: 'required field' }).min(10, "Enter the right format mobile number"),
    })
});


export type mentorPayloadInput = Omit<TypeOf<typeof mentorPayload>, "body.passwordConfirmation">;