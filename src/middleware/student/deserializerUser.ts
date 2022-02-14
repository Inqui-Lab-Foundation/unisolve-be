/*Importing the dependencies*/
import sessionService from '@src/services/session.services';
import { verifyJwt } from "../../utils/jwt";
import { NextFunction, Request, Response } from "express";
import { get } from "lodash";

/**
 * this is middleware function help the application in authorization,
 * check the access and refresh @token with the help of jwt @package.
 * @param req Request as req from express @package.
 * @param res Response as res from express @package.
 * @param next nextFunction as next from express @package.
 * @returns next if the user as access/refresh token.
 */
const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
    );
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
        const result = verifyJwt(newAccessToken as string);
        res.locals.user = result.decoded;
        return next();
    }
    return next();
};

export default deserializeUser;