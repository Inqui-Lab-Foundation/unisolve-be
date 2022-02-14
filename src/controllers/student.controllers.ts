import { Request, Response } from "express";

import logger from '@src/utils/logger'
import studentServices from "@src/services/student.services";
import sessionServices from "@src/services/session.services";
import { CreateUserInput } from "@src/schemas/student/studentRegistration.schema";
import { signJwt } from "@src/utils/jwt";
import config from "config";


class studentController {
    async registerHandler(
        req: Request<{}, {}, CreateUserInput["body"]>,
        res: Response) {

        try {
            const record = await studentServices.buildStudent(req.body)
            return res.status(200).json({ record, message: "Student successfully Registered" })
        } catch (error) {
            return res.json({
                message: "failed to register student, something went wrong",
                status: 500,
                router: '/api/student/register'
            })
        }
    };
    async loginHandler(
        req: Request<{}, {}, CreateUserInput["body"]>,
        res: Response) {
        try {
            const record = await studentServices.authenticateStudent(req.body);
            if (!record) {
                return res.status(401).json({ message: "Invalid email or password"})
            }
            const input = { userId: record.id, userAgent: req.get("user-agent") || "", valid: true}
            const session = await sessionServices.createSession(input);
            const accessToken = signJwt(
                { record, session: session.getDataValue('id') },
                { expiresIn: config.get<string>('accessTokenTtl') }
            );
            const refreshToken = signJwt(
                { record, session: session.getDataValue('id') },
                { expiresIn: config.get<string>('refreshTokenTtl') }
            );
            const { id, email, name, } = record
            return res.send({ id, name, email, accessToken, refreshToken });
        } catch (error: any) {
            logger.error(error);
            return res.status(409).send(error.message)
        }
    }
}

/**
 * try {
        const user = await validatePassword(req.body);
        if (!user) {
            return res.status(401).send("Invalid email or password")
        }
        const session = await createSession(user._id, req.get("user-agent") || "");
        const accessToken = signJwt(
            { ...user.toObject(), session: session._id },
            { expiresIn: config.get<string>('accessTokenTtl') }
        );
        const refreshToken = signJwt(
            { ...user.toObject(), session: session._id },
            { expiresIn: config.get<string>('refreshTokenTtl') }
        );
        const { _id, email, name, createdAt, updatedAt } = user
        return res.send({ _id, name, email, createdAt, updatedAt, accessToken, refreshToken });
    } catch (error: any) {
        logger.error(error);
        return res.status(409).send(error.message)
    }
 */

export default new studentController();