import {Request, Response, NextFunction} from 'express';
import HttpException from '../utils/exceptions/http.exception';
import {wildcardRoutes} from '../configs/wildcardRoutes.config';
import logger from '../utils/logger';
import { speeches } from '../configs/speeches.config';
import JwtUtil from '../utils/jwt.util';
import { unauthorized } from 'boom';

export default function routeProtectionMiddleware(
    req: Request, 
    res: Response, 
    next: NextFunction
    ): void{
        if (wildcardRoutes.indexOf(req.path) > -1) {
            res.locals ={
                id: process.env.DEFAULT_AUDIT_USER || '',
            };
            next();
        } else {
            if (req.headers.authorization === undefined || req.headers.authorization === "" || req.headers.authorization.indexOf("Bearer ") !== 0) {
                let data = { 
                    status: 401,
                    status_type: "error",
                    message: speeches.UNAUTHORIZED_ACCESS,
                };
                logger.error(`${req.path} :: ${data.message} Error-Object:${req.headers}`);
                // res.status(401).json(data).end();
                throw unauthorized(data.message);
            } else {
                const token = req.headers.authorization.replace("Bearer ", "");
                JwtUtil.validateToken(token).then((data: any) => {
                    if(data.message != undefined && data.message == "Invalid token."){
                        let errData = { 
                            status: 401,
                            status_type: "error",
                            message: speeches.INVALID_TOKEN,
                        };
                        logger.error(`${req.path} :: ${data.message} Error-Object:${JSON.stringify(data)}`);
                        // res.status(401).json(data).end();
                        // throw new HttpException(errData.status, errData.message, errData);
                        throw unauthorized(errData.message);
                    }else if(data.message != undefined && data.message == "jwt expired"){
                        let errData = { 
                            status: 401,
                            status_type: "error",
                            message: speeches.TOKEN_EXPIRED,
                        };
                        logger.error(`${req.path} :: ${data.message} Error-Object:${JSON.stringify(data)}`);
                        // res.status(401).json(data).end();
                        // throw new HttpException(errData.status, errData.message, errData);
                        throw unauthorized(errData.message);
                    }else{
                        res.locals = data;
                        next();
                    }
                }).catch((err: any) => {
                    let data = { 
                        status: 401,
                        status_type: "error",
                        message: speeches.UNAUTHORIZED_ACCESS,
                    };
                    logger.error(`${req.path} :: ${data.message} Error-Object:${JSON.stringify(data)}`);
                    // res.status(401).json(data).end();
                    // throw new HttpException(errData.status, errData.message, errData);
                    next(unauthorized(data.message));
                });            
            }
        }
}