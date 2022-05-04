/*Importing the dependencies*/
import { verifyJwt } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
/**
 * middleware function while verify the token and store the user details in res.locals forwards the request to the API controller.
 * @param req Http request
 * @param res Http response
 * @param next Express next function
 * @returns next function.
 */
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
        return res.sendStatus(401);
    }
    return next();
};

export default verifyToken;