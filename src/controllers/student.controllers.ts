import { Request, Response } from "express";
import config from "config";

import logger from '../utils/logger'
import studentServices from "../services/student.services";
import sessionServices from "../services/session.services";
import { signJwt } from "../utils/jwt";
import storeLogsToDatabase from "../services/databaseLogger.service";

class StudentController {
    public async registerHandler(req: Request, res: Response) {
        const { email } = req.body;
        const match = await studentServices.find({ where: { email } });
        if (match) return res.status(409).json({ message: "User details are already existed." });
        const storeDetailsToDatabase = await studentServices.build(req.body);
        if (!storeDetailsToDatabase) return res.status(500).json({ message: "Oops. Something went wrong. Please try again" });
        logger.info(`admin registered successfully ${JSON.stringify(storeDetailsToDatabase)}`);
        storeLogsToDatabase(req, storeDetailsToDatabase, 'success');
        return res.status(201).json({ info: storeDetailsToDatabase, message: "Student registered successfully." });
    };
    public async loginHandler(req: Request, res: Response) {
        const { email, mobile, student_name, password } = req.body;
        let match;
        if (email) match = await studentServices.find({ where: { email } });
        if (mobile) match = await studentServices.find({ where: { mobile } });
        if (student_name) match = await studentServices.find({ where: { student_name } });
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
    public async changePasswordHandler(req: Request, res: Response) {
        const updateThePassword = await studentServices.changePassword(req.body);
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
        storeLogsToDatabase(req, { message: "cleared student session successfully" }, 'success')
        return res.status(200).json({ message: "cleared student session successfully" });
    };
}

export default new StudentController();