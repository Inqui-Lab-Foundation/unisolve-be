import { Request, Response,NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import { speeches } from '../configs/speeches.config';
import dispatcher from '../utils/dispatch.util';

export default function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };

        try {
            const value = await schema.validateAsync(request.body, validationOptions);
            request.body = value;
            next();
        } catch (error: any) {
            const errors: string[] = [];
            error.details.forEach((e: Joi.ValidationErrorItem) => {
                errors.push(e.message);
            });
            response.status(400).send(dispatcher(errors, 'validation', speeches.BAD_REQUEST));
        }
    }
}