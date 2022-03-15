/*Importing the dependencies*/
import { object, z, TypeOf, } from "zod";
import { Omit } from 'lodash';

export const evaluatorUpdate = object({
    body: object({
        statue: z.enum(["Active", "Inactive"])
    })
});


export type MentorUpdateInput = Omit<TypeOf<typeof evaluatorUpdate>, "body.passwordConfirmation">;


