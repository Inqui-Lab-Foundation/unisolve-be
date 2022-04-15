/*Importing the dependencies*/
import { verifyJwt } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";
import { get } from "lodash";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    if (!accessToken) {
        return res.sendStatus(401);
    }
    const { decoded } = verifyJwt(accessToken);
    if (decoded) {
        //@ts-ignore
        res.locals = decoded.foundUser;
        return next();
    }
    //@ts-ignore
    if (!req.userInfo) {
        return res.sendStatus(409);
    }
    return next();
};

export default verifyToken;