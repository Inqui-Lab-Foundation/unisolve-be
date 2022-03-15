/*Importing the dependencies*/
import { object, z, TypeOf, } from "zod";
import { Omit } from 'lodash';

export const mentorUpdate = object({
    body: object({
        statue: z.enum(["Active", "Inactive"])
    })
});


export type MentorUpdateInput = Omit<TypeOf<typeof mentorUpdate>, "body.passwordConfirmation">;


