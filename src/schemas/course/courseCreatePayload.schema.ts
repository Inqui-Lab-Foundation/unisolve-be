/*Importing the dependencies*/
import { object, string, z, TypeOf,  } from "zod";
import { Omit } from 'lodash';

export const courserPayload = object({
    body: object({
        module: string({
            required_error: 'Name is required field'
        }),
        courser_id: string({
            required_error: 'Password is required field'
        }).min(6, 'Password should be minimum of 6 characters'),
        statue: z.enum(["Completed", "Incomplete"])
    })
});


export type courserPayloadInput = Omit<TypeOf<typeof courserPayload>, "body.passwordConfirmation">;