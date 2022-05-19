import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validator = (Schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
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

export default validator