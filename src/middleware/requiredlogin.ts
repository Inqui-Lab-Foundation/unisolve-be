/*Importing the dependencies*/
import { NextFunction, Request, Response } from "express";

/**
 * middleware function help in checks user details stored in res.locals.user
 * @param req Request from express @package.
 * @param res Response from express @package.
 * @param next nextFunction from express @package.
 * @returns next if the details found or response with status code of 403 forbidden if details not found
 */
const requiredUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!user) return res.status(403);
    return next();
};

export default requiredUser;