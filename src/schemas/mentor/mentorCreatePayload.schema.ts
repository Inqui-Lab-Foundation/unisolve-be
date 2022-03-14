/*Importing the dependencies*/
import { object, string, z, TypeOf, } from "zod";
import { Omit } from 'lodash';

export const mentorPayload = object({
    body: object({
        mentor_name: string({
            required_error: 'Name is required field'
        }),
        mobile: string({
            required_error: 'mobile is required field'
        }).min(10, 'mobile should be minimum of 10 characters').max(10, 'mobile should be minimum of 10 characters'),
        email: string({ required_error: 'Email is required field' }).email('not a valid email'),
        statue: z.enum(["Completed", "Incomplete"])
    })
});


export type mentorPayloadInput = Omit<TypeOf<typeof mentorPayload>, "body.passwordConfirmation">;