/*Importing the dependencies*/
import { object, z, TypeOf, } from "zod";
import { Omit } from 'lodash';

export const CourseUpdate = object({
    body: object({
        statue: z.enum(["Completed", "Incomplete"])
    })
});


export type CourseUpdateInput = Omit<TypeOf<typeof CourseUpdate>, "body.passwordConfirmation">;


