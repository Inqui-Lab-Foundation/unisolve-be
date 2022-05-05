import { Request, Response } from "express";
import config from "config";

import logger from '../utils/logger'
import studentServices from "../services/student.services";
import sessionServices from "../services/session.services";
import { signJwt } from "../utils/jwt";
import operationalServices from "../services/operational.services";
import { log } from "../models/log";

// controller handlers class
class authController {
    //new student handler response with the created student, conflict if the student exist, and error message if anything went wrong
    async registerHandler(req: Request, res: Response) {
        const { email } = req.body;

        //checking for duplicate
        const match = await studentServices.findStudent({ where: { email } });
        if (match) return res.sendStatus(409);

        //create student with the help studentService
        const newStudent = await studentServices.buildStudent(req.body);
        if (!newStudent) return res.sendStatus(500);
        operationalServices.build(log, {
            api_name: req.originalUrl,
            request_method: req.method,
            request: `${JSON.stringify(req.body)}`,
            response: `${JSON.stringify(newStudent)}`,
            status: 'success'
        });
        return res.status(201).json({ studentInfo: newStudent, message: "student successfully Registered" });
    };
    // student login handler find the students, create the session and issues token   
    async loginHandler(req: Request, res: Response) {
        const { email, mobile, student_name, password } = req.body
        let match;
        // finding the student with the email, mobile, student_name
        if (email) match = await studentServices.findStudent({ where: { email } });
        if (mobile) match = await studentServices.findStudent({ where: { mobile } });
        if (student_name) match = await studentServices.findStudent({ where: { student_name } });

        //if student not found
        if (!match) return res.sendStatus(401);
        const foundStudent = match;
        const foundSession = await sessionServices.destroySession(foundStudent.id); // deleting existing if any with student_id
        // validating the student password
        if (password === foundStudent.password) {
            const input = { userId: foundStudent.id, userAgent: req.get("User-Agent") || "", valid: true };
            const session = await sessionServices.createSession(input); // creating new session 
            const Token = signJwt(
                { foundStudent, session: session.id },
                { expiresIn: config.get<string>('accessTokenTtl') }
            ); // issuing access token
            const { id, student_name, email } = foundStudent;
            logger.info(`student logged in ${JSON.stringify(foundStudent)}`);
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify({ id, student_name, email })}`,
                status: 'success'
            });
            return res.status(200).json({ id, student_name, email, Token });
        }
        logger.error(`Invalid email or password, fail to validate the password please check and try again`);
        return res.sendStatus(403);
    };
    // student change password handler
    async changePasswordHandler(req: Request, res: Response) {
        try {
            console.log(req.body);
            const record = await studentServices.changePassword(req.body);
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(record)}`,
                status: 'success'
            });
            return res.status(202).json({ message: "Password updated successfully" });
        } catch (error: any) {
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(error.message)}`,
                status: 'failed'
            });
            return res.status(503).json({ message: error.message })
        }
    };
    // student logout handler marking session validate false
    async logoutHandler(req: Request, res: Response) {
        //@ts-ignore
        const userId = res.locals.id;
        try {
            const foundSession = await sessionServices.findSession({ where: { userId } });
            if (!foundSession) res.status(409).json({ message: 'session not found' })
            foundSession.setDataValue('valid', false);
            foundSession.save();
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify({ message: "cleared student session successfully" })}`,
                status: 'success'
            });
            return res.status(200).json({ message: "cleared student session successfully" });
        } catch (error: any) {
            res.sendStatus(400);
        }
    };
}

export default new authController();