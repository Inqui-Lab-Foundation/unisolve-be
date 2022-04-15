import { Request, Response } from "express";
import config from "config";

import logger from '../utils/logger'
import studentServices from "../services/student.services";
import sessionServices from "../services/session.services";
import { CreateUserInput, CreateUserPassword } from "../schemas/student.schema";
import { signJwt } from "../utils/jwt";

// controller handlers class
class authController {
    // response with the number of seconds the current Node.js process has been running and timestamp
    healthCheck(req: Request, res: Response) {
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        };
        try {
            res.send(healthcheck);
        } catch (error: any) {
            healthcheck.message = error;
            res.status(503).send(error);
        }
    }
    //new user handler response with the created user, conflict if the user exist, and error message if anything went wrong
    async registerHandler(req: Request, res: Response) {
        const { email } = req.body;
        //checking for duplicate entry
        const foundUser = await studentServices.findStudent({ where: { email } });
        if (foundUser) {
            logger.info(`Account already exist ${JSON.stringify(foundUser)}`)
            return res.sendStatus(409); // conflict
        } try {
            //create user with the help studentService
            const newRecord = await studentServices.buildStudent(req.body);
            logger.info(`Student successfully registered ${JSON.stringify(newRecord)}`)
            return res.status(201).json({ record: newRecord, message: "Student successfully Registered" })
        } catch (error: any) {
            logger.error(error.message);
            return res.status(500).send({ message: error.message })
        }
    };
    // user login handler find the users, create the session and issues token   
    async loginHandler(req: Request, res: Response) {
        const { student_name, mobile, email, password } = req.body;
        let foundUser;
        // finding the user with the email, mobile, user_name
        if (email) foundUser = await studentServices.findStudent({ where: { email } });
        if (mobile) foundUser = await studentServices.findStudent({ where: { mobile } });
        if (student_name) foundUser = await studentServices.findStudent({ where: { student_name } });
        if (foundUser) {
            const userId = foundUser.id;
            // deleting existing if any with user_id
            await sessionServices.destroySession(userId);
            try {
                // validating the user password
                const record = await studentServices.authenticateStudent(password, foundUser.password);
                if (record) {
                    // creating new session 
                    const input = { userId: foundUser.id, userAgent: req.get("user-agent") || "", valid: true };
                    const session = await sessionServices.createSession(input);
                    logger.info(`Session Created, ${JSON.stringify(session)}`);
                    // creating access token
                    const accessToken = signJwt(
                        { foundUser, session: session.id },
                        { expiresIn: config.get<string>('accessTokenTtl') }
                    );
                    const { id, res_email, student_name } = foundUser
                    logger.info(`Student logged in ${JSON.stringify(record)}`)
                    return res.send({ id, student_name, res_email, accessToken });
                } else {
                    logger.error(`Invalid email or password Can't validate the password please check and try again`);
                    return res.status(403).json({ message: "Invalid email or password Can't validate the password please check and try again" });
                }
            } catch (error: any) {
                logger.error(error);
                return res.status(409).send(error.message)
            }
        } res.status(500).send({ message: "Can't find the student please check the payload" })
    };
    // user change password handler
    async changePasswordHandler(
        req: Request<{}, {}, CreateUserPassword["body"]>,
        res: Response) {
        const record = await studentServices.changePassword(req.body);
        if (record.error) {
            return res.status(503).json({ message: record.error })
        } return res.status(202).json({ message: "Password updated successfully" })
    };
    // user logout handler marking session validate false
    async logoutHandler(req: Request, res: Response) {
        //@ts-ignore
        const userId = res.locals.id;
        try {
            const findSession = await sessionServices.findSession({ where: { userId } });
            if (!findSession) {
                res.status(409).send({ message: 'session not found' })
            }
            findSession.setDataValue('valid', false);
            findSession.save();
            res.status(200).json({ message: "cleared student session successfully" })
        } catch (error: any) {
            res.status(400).json({ message: "bad request" })
        }
    }
}

export default new authController();