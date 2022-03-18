/*Importing the dependencies*/
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

/**
 * middleware function validates the request with zod scheme
 * @param Schema it's Zod object with list of required fields pre-settee.
 * @returns next if the request body match the schema,
 * @throws error with status code 400 if the validation fails.
 */

const validate = (Schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        Schema.parse({
            body: req.body,
            query: req.query,
            param: req.params,
        });
        next()
    } catch (error: any) {
        return res.status(400).send(error.message)
    }
}

export default validate