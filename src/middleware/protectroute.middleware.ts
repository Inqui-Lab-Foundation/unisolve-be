import { Request, Response, NextFunction } from "express";
import wildcardRoutes from '../../config/wildcardroutes'
import { verifyJwt } from "../utils/jwt";
import logger from "../utils/logger";

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
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
                message: "UnAuthorized Access!. Kindly provide a valid token"
            };
            logger.error(`${req.path} :: ${data.message} Error-Object:${JSON.stringify(data)}`);
            res.status(401).json(data).end();
        } else {
            const token = req.headers.authorization.replace("Bearer ", "");
            verifyJwt(token).then((data) => {
                if(data.message != undefined && data.message == "Invalid token."){
                    let data = { 
                        status: 401,
                        status_type: "error",
                        message: "Invalid token!. Kindly provide a valid token"
                    };
                    logger.error(`${req.path} :: ${data.message} Error-Object:${JSON.stringify(data)}`);
                    res.status(401).json(data).end();
                }else if(data.message != undefined && data.message == "jwt expired"){
                    let data = { 
                        status: 401,
                        status_type: "error",
                        message: "Token Expired!. Kindly provide a valid token"
                    };
                    logger.error(`${req.path} :: ${data.message} Error-Object:${JSON.stringify(data)}`);
                    res.status(401).json(data).end();
                }else{
                    res.locals = data.match;
                    next();
                }
            }).catch((err) => {
                let data = { 
                    status: 401,
                    status_type: "error",
                    message: "Invalid Token!"
                };
                logger.error(`${req.path} :: ${data.message} Error-Object:${err}`);
                res.status(401).json(data).end();
            });            
        }
    }
};

export default protectRoute;