import { Request, Response,NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import { nextTick } from 'process';
import HttpException from '../utils/exceptions/http.exception';

export default function validationMiddleware(schema?: Joi.Schema | null): RequestHandler {
    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        if(!schema) {
            next();
        }
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };
        try {
            const value = await schema?.validateAsync(request.body, validationOptions);
            request.body = value;
            next();
        } catch (error: any) {
            const errors: string[] = [];
            error.details.forEach((e: Joi.ValidationErrorItem) => {
                errors.push(e.message);
            });
            // response.status(400).send({errors: errors});
            next(new HttpException(400, 'Validation failed', errors)) ;
        }
    }
}