// importing dependence
import { Request, Response } from "express";
import config from "config";

import logger from '../utils/logger'
import studentServices from "../services/student.services";
import sessionServices from "../services/session.services";
import { CreateUserInput, CreateUserPassword } from "../schemas/student.schema";
import { signJwt } from "../utils/jwt";

/**
 * Controller class for all student API's 
 */
class studentController {

    async registerHandler(
        req: Request<{}, {}, CreateUserInput["body"]>,
        res: Response) {
        const { email } = req.body;
        const findEntry = await studentServices.findStudent(email);
        if (findEntry) {
            logger.info(`Account already exist ${JSON.stringify(findEntry)}`)
            return res.status(406).send({ message: "account already exist", Record: findEntry })
        }
        try {
            const newRecord = await studentServices.buildStudent(req.body);
            logger.info(`Student successfully registered ${JSON.stringify(newRecord)}`)
            return res.status(200).json({ record: newRecord, message: "Student successfully Registered" })
        } catch (error: any) {
            logger.error(error.message);
            return res.status(500).send({ error: error.message })
        }
    };

    async loginHandler(
        req: Request<{}, {}, CreateUserInput["body"]>,
        res: Response) {
        const { email, password } = req.body;
        const findEntry = await studentServices.findStudent(email);
        if (findEntry) {
            const userId = findEntry.id;
            await sessionServices.destroySession(userId);
            try {
                const record = await studentServices.authenticateStudent(email, password);
                if (!record) {
                    logger.error(`Invalid email or password`);
                    return res.status(403).json({ message: "Invalid email or password" });
                }
                const input = { userId: record.id, userAgent: req.get("user-agent") || "", valid: true };
                const session = await sessionServices.createSession(input);
                logger.info(`Session Created, ${JSON.stringify(session)}`);
                const accessToken = signJwt(
                    { record, session: session.id },
                    { expiresIn: config.get<string>('accessTokenTtl') }
                );
                const refreshToken = signJwt(
                    { record, session: session.id },
                    { expiresIn: config.get<string>('refreshTokenTtl') }
                );
                const { id, res_email, student_name } = record
                logger.info(`Student logged in ${JSON.stringify(record)}`)
                return res.send({ id, student_name, res_email, accessToken, refreshToken });
            } catch (error: any) {
                logger.error(error);
                return res.status(409).send(error.message)
            }
        }
    };
    /**
     * 
     * @param req express request
     * @param res express response
     * @returns JSON with success message or error message
     */
    async changePasswordHandler(
        req: Request<{}, {}, CreateUserPassword["body"]>,
        res: Response) {
        try {
            const record = await studentServices.changePassword(req.body);
            return res.status(202).json({ message: "Password updated successfully" })
        } catch (error) {
            return res.status(405).json({ message: "Method Not Allowed" })
        }
    };
    // Todo: need to update the logout API
    async logoutHandler(req: Request, res: Response) {
        const userID = res.locals.user.record.id
        try {
            const findSession = await sessionServices.findSession({ userID });
            if (!findSession) {
                res.status(409).send({ message: 'session not found' })
            }
            findSession.setDataValue('valid', false);
            findSession.save();
            res.clearCookie('jwt');
            res.status(200).json({ message: "cleared student session successfully" })
        } catch (error: any) {
            res.status(400).json({ message: "bad request" })
        }
    }

}

export default new studentController();