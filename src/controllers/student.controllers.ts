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
        const { email } = req.body
        const findEntry = await studentServices.findStudent({ email });
        if (findEntry) {
            return res.status(406).send({ message: "account already exist", Record: findEntry })
        }
        try {
            const record = await studentServices.buildStudent(req.body)
            return res.status(200).json({ record, message: "Student successfully Registered" })
        } catch (error: any) {
            return res.status(500).send({
                error: error.message,
                router: '/api/v1/student/register'
            })
        }
    };
    async loginHandler(
        req: Request<{}, {}, CreateUserInput["body"]>,
        res: Response) {
        try {
            const record = await studentServices.authenticateStudent(req.body);
            if (!record) {
                return res.status(401).json({ message: "Invalid email or password" })
            }
            const input = { userId: record.id, userAgent: req.get("user-agent") || "", valid: true }
            const session = await sessionServices.createSession(input);
            const accessToken = signJwt(
                { record, session: session.getDataValue('id') },
                { expiresIn: config.get<string>('accessTokenTtl') }
            );
            const refreshToken = signJwt(
                { record, session: session.getDataValue('id') },
                { expiresIn: config.get<string>('refreshTokenTtl') }
            );
            const { id, email, student_name, } = record
            return res.send({ id, student_name, email, accessToken, refreshToken });
        } catch (error: any) {
            logger.error(error);
            return res.status(409).send(error.message)
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
    async logoutHandler(req: Request, res: Response) {
        try {
            res.clearCookie('jwt');
            res.status(200).json({ message: "cleared student session successfully" })
        } catch (error: any) {
            res.status(404).json({ message: "bad request" })
        }
    }
}

export default new studentController();