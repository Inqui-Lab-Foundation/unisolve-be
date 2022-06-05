import {Request, Response, NextFunction} from 'express';
import HttpException from '../utils/exceptions/http.exception';
import logger from '../utils/logger';

export default function errorMiddleware(
    error: HttpException, 
    request: Request, 
    response: Response, 
    next: NextFunction
    ): void{
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        logger.error(`${request.method} ${request.url} ${status} - ${message} - Error-Obj: ${error}`);
        response.status(status).send({
            status,
            message,
            // data: error.data
        });
}