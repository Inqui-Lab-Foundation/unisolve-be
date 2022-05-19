import { verifyJwt } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { get } from "lodash";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    if (!accessToken) {
        return res.status(401).json({ message: "You API key is missing, please check and hit back" });
    }
    const { decoded } = verifyJwt(accessToken);
    if (decoded) {
        //@ts-ignore
        res.locals = decoded.foundUser;
        return next();
    }
    //@ts-ignore
    if (!req.userInfo) {
        return res.status(401).json({message: "You API key is missing, please check and hit back"});
    }
    return next();
};

export default verifyToken;