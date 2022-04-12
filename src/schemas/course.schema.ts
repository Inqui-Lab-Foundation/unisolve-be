/*Importing the dependencies*/
import { object, string, z, TypeOf, } from "zod";
import { Omit } from 'lodash';

export const coursePayload = object({
    body: object({
        course_name: string({required_error: 'Name is required field'}),
        description: string({ required_error: 'description is required field'})
    })
});


export type coursePayloadInput = Omit<TypeOf<typeof coursePayload>, "body.passwordConfirmation">;

export const courseUpdate = object({
    body: object({
        status: z.enum(["Completed", "Incomplete"])
    })
});


export type courseUpdateInput = Omit<TypeOf<typeof courseUpdate>, "body.passwordConfirmation">;


