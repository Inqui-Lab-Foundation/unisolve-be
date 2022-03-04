/*Importing the dependencies*/
import { object, string, TypeOf } from "zod";

export const userLogout = object({
    body: object({email: string({ required_error: 'Email is required field' }).email('not a valid email')})
});