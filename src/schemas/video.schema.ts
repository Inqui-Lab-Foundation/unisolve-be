/*Importing the dependencies*/
import { object, string, z, TypeOf, } from "zod";
import { Omit } from 'lodash';

export const videoPayload = object({
    body: object({
        module: string({
            required_error: 'Name is required field'
        }),
        video_id: string({
            required_error: 'Password is required field'
        })
    })
});


export type videoPayloadInput = Omit<TypeOf<typeof videoPayload>, "body.passwordConfirmation">;

export const videoUpdate = object({
    body: object({
        status: z.enum(["Completed", "Incomplete"])
    })
});


export type videoUpdateInput = Omit<TypeOf<typeof videoUpdate>, "body.passwordConfirmation">;


