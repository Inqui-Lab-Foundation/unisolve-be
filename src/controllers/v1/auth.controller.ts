import { Request, Response, NextFunction } from "express";
import path from 'path';
import config from "config";
import { writeFile } from 'fs';

import logger from '../../utils/logger'
import adminServices from "../../services/admin.services";
import sessionServices from "../../services/session.services";
import storeLogsToDatabase from "../../services/databaseLogger.service";
import dynamicSignupFormMasterObject from '../../../config/dynamicForm';
import { signJwt } from "../../utils/jwt";
import { nextTick } from "process";

class AuthController {
    public async registerUser(req: Request, res: Response, next:NextFunction) {
        const { email } = req.body;
        const match = await adminServices.find({ where: { email } });
        if (match) {
            res.status(409).json({ message: "User details are already existed." });
            next();
        }
        const storeDetailsToDatabase = await adminServices.build(req.body);

        if (!storeDetailsToDatabase) {
            res.status(503).json({ message: "Oops, Something went wrong. Please try again" });
            next();
        }else{
            logger.info(`admin registered successfully ${JSON.stringify(storeDetailsToDatabase)}`);
            storeLogsToDatabase(req, storeDetailsToDatabase, 'success');
            res.status(201).json({ info: storeDetailsToDatabase, message: "Admin registered successfully." });
        } 
        next();
    };


    public async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        let match = await adminServices.find({ where: { email, password } });
        if (!match){
            logger.error(`Invalid email or password. :: ${req.path} :: Requisted-Object: ${JSON.stringify(req.body)}`);
            res.status(403).json({ message: "Invalid email or password" });
            next();
        }
        await sessionServices.destroySession(match.id);
        const newSessionObject = { userId: match.id, studentAgent: req.get("student-agent") || "", valid: true };
        const session = await sessionServices.createSession(newSessionObject);
        const IssueToken = signJwt(
            { match, session: session.id },
            { expiresIn: config.get<string>('accessTokenTtl') }
        );
        const { id, role } = match;
        logger.info(`admin logged in ${JSON.stringify(match)}`);
        storeLogsToDatabase(req, { id, role, email, IssueToken }, 'success');
        res.status(200).json({ id, role, email, Token: IssueToken });
        next();
    };

    // student change password handler
    public async changePassword(req: Request, res: Response, next: NextFunction) {
        const updateThePassword = await adminServices.changePassword(req.body);
        if (!updateThePassword) {
            storeLogsToDatabase(req, {
                message: `Oops, Something went wrong. Please check the payload and try again. Requested-Object: ${JSON.stringify(req.body)}`,
            }, 'failed');
            res.status(503).json({ message: 'Oops, Something went wrong. Please check the payload and try again' });
            next();
        }
        storeLogsToDatabase(req, updateThePassword, 'success')
        res.status(202).json({ message: "Password updated successfully" })
        next();
    };

    public async logout(req: Request, res: Response, next: NextFunction) {
        const userId = res.locals.id;
        const findSession = await sessionServices.findSession({ where: { userId } });
        if (!findSession){
            res.status(409).json({ message: "Session not found" });
            next();
        }
        findSession.setDataValue('valid', false);
        findSession.save();
        storeLogsToDatabase(req, { message: "cleared session successfully" }, 'success')
        res.status(200).json({ message: "cleared session successfully" });
        next();
    };

    public async createSignupConfig(req: Request, res: Response, next: NextFunction) {
        const result: any = dynamicSignupFormMasterObject.getFormObject(req.body);
        
        await writeFile(path.join(process.cwd(), "/dist/config/singUp.json"), JSON.stringify(result), function (err) {
            if (err) {
                storeLogsToDatabase(req, { message: 'Oops, Something went wrong. Please check the payload and try again', err }, 'failed')
                res.status(503).json({ message: 'Oops, Something went wrong. Please check the payload and try again', err });
                next();
            } else {
                storeLogsToDatabase(req, { message: "successfully created json file" }, 'success')
                res.status(200).json({ message: "successfully created json file" });
                next();
            }
        });
    };

    public async getSignUpConfig(req: Request, res: Response) {
        var options = {
            root: path.join(process.cwd(), "/dist/config/singUp.json"),
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
        storeLogsToDatabase(req, { message: "getting the json file" }, 'success');
        return res.status(200).sendFile('singUp.json', options);
    }
};

export default new AuthController();
