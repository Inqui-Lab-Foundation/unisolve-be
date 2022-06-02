import path from 'path';
import config from "config";
import { writeFile } from 'fs';
import { Request, Response } from "express";

import logger from '../utils/logger'
import adminServices from "../services/admin.services";
import sessionServices from "../services/session.services";
import storeLogsToDatabase from "../services/databaseLogger.service";
import dynamicSignupFormMasterObject from '../../config/dynamicForm';
import { signJwt } from "../utils/jwt";

class AdminController {
    public async registerHandler(req: Request, res: Response) {
        const { email } = req.body;
        const match = await adminServices.find({ where: { email } });
        if (match) return res.status(409).json({ message: "User details are already existed." });
        const storeDetailsToDatabase = await adminServices.build(req.body);
        if (!storeDetailsToDatabase) return res.status(500).json({ message: "Oops. Something went wrong. Please try again" });
        logger.info(`admin registered successfully ${JSON.stringify(storeDetailsToDatabase)}`);
        storeLogsToDatabase(req, storeDetailsToDatabase, 'success');
        return res.status(201).json({ info: storeDetailsToDatabase, message: "Admin registered successfully." });
    };
    public async loginHandler(req: Request, res: Response) {
        const { email, password } = req.body;
        let match = await adminServices.find({ where: { email } });
        if (!match) return res.status(401).json({ message: "User details are not found in the database" });
        await sessionServices.destroySession(match.id);
        if (password === match.password) {
            const newSessionObject = { userId: match.id, studentAgent: req.get("student-agent") || "", valid: true };
            const session = await sessionServices.createSession(newSessionObject);
            const IssueToken = signJwt(
                { match, session: session.id },
                { expiresIn: config.get<string>('accessTokenTtl') }
            );
            const { id, email, role } = match;
            logger.info(`admin logged in ${JSON.stringify(match)}`);
            storeLogsToDatabase(req, { id, role, email, IssueToken }, 'success');
            return res.status(200).json({ id, role, email, Token: IssueToken });
        }
        logger.error(`Invalid email or password, fail to validate the password please check and try again`);
        return res.status(403).json({ message: "invalid email or password, please check th payload" });
    };
    // student change password handler
    public async changePasswordHandler(req: Request, res: Response) {
        const updateThePassword = await adminServices.changePassword(req.body);
        if (!updateThePassword) {
            storeLogsToDatabase(req, {
                message: 'Oops, Something went wrong. Please check the payload and try again'
            }, 'failed');
            return res.status(503).json({ message: 'Oops, Something went wrong. Please check the payload and try again' });
        }
        storeLogsToDatabase(req, updateThePassword, 'success')
        return res.status(202).json({ message: "Password updated successfully" })

    };
    public async logoutHandler(req: Request, res: Response) {
        //@ts-ignore
        const userId = res.locals.id;
        const findSession = await sessionServices.findSession({ where: { userId } });
        if (!findSession) res.status(409).json({ message: "Session not found" })
        findSession.setDataValue('valid', false);
        findSession.save();
        storeLogsToDatabase(req, { message: "cleared session successfully" }, 'success')
        return res.status(200).json({ message: "cleared session successfully" });
    };

    public async createSignupConfig(req: Request, res: Response) {
        const result: any = new Object();
        for (let i in dynamicSignupFormMasterObject) {
            for (let j in Object.keys(req.body)) {
                if (i === Object.keys(req.body)[j]) {
                    result[i] = dynamicSignupFormMasterObject[i];
                }
            }
        }
        new Promise((resolve, reject) => {
            writeFile('./dist/config/singUp.json', JSON.stringify(result), function (err) {
                if (err) {
                    reject;
                    storeLogsToDatabase(req, { message: 'Oops, Something went wrong. Please check the payload and try again', err }, 'failed')
                    return res.status(503).json({ message: 'Oops, Something went wrong. Please check the payload and try again', err });
                } else {
                    resolve;
                    // console.log(first)
                    storeLogsToDatabase(req, { message: "successfully created json file" }, 'success')
                    return res.status(200).json({ message: "successfully created json file" });
                }
            });
        });
    };

    public async getSignUpConfig(req: Request, res: Response) {
        // console.log("process", process);
        var options = {
            root: path.join(process.cwd(), '/dist/config'),
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
        storeLogsToDatabase(req, { message: "getting the json file" }, 'success');
        return res.status(200).sendFile('singUp.json', options);
    }
};

export default new AdminController();
