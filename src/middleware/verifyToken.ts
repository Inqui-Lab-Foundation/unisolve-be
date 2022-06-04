import { verifyJwt } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { get } from "lodash";

// const wildcard_routes = [];

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {



    // check white list APIs
    const urlparts = req.url.slice(1).split("/");
    
    if(true){
        console.log(req.url.slice(1))
    }
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    if (!accessToken) {
        return res.status(401).json({ message: "You API key is missing, please check and hit back" });
    }
    // const { decoded } = verifyJwt(accessToken);
    // if (decoded) {
    //     //@ts-ignore
    //     res.locals = decoded.foundUser;
    //     next();
    // }
    // //@ts-ignore
    // if (!req.userInfo) {
    //     return res.status(401).json({message: "You API key is missing, please check and hit back"});
    // }
    next();
};

export default verifyToken;