/*Importing the dependencies*/
import sessionService from '../../services/session.services';
import { verifyJwt } from "../../utils/jwt";
import { NextFunction, Request, Response } from "express";
import { get } from "lodash";

/**
 * middleware function help the application in authorization,
 * check the access and refresh token with the help of jwt.
 * @param req Request from express @package.
 * @param res Response from express @package.
 * @param next nextFunction from express @package.
 * @returns next if the user as access/refresh token.
 */
const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = get(req, "headers.authorization", "").replace(
        /^Bearer\s/, "");
    const refreshToken = get(req, "headers.x-refresh");
    if (!accessToken) {
        return next();
    }
    const { decoded, expired } = verifyJwt(accessToken);
    if (decoded) {
        res.locals.user = decoded;
        return next();
    }
    if (expired && refreshToken) {
        const newAccessToken = await sessionService.reIssuesAccessToken({ refreshToken });
        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);
        }
        const { decoded } = verifyJwt(newAccessToken as string);
        res.locals.user = decoded;
        return next();
    }
    return next();
};

export default deserializeUser;