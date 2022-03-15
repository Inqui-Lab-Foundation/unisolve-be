/*Importing the dependencies*/
import { object, z, TypeOf, } from "zod";
import { Omit } from 'lodash';

export const mentorUpdate = object({
    body: object({
        statue: z.enum(["Completed", "Incomplete"])
    })
});


export type MentorUpdateInput = Omit<TypeOf<typeof mentorUpdate>, "body.passwordConfirmation">;


