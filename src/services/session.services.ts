import { get } from "lodash";
import config from 'config'
import { signJwt, verifyJwt } from "../utils/jwt";
import { session } from "../models/session.model";
import { student } from "../models/student.model";
import OperationalService from "./operational.services";
import logger from '../utils/logger';


// service for all the user session controllers
class sessionService {
    async createSession(input: any) {
        try {
            const sessionCreated = await OperationalService.build(session, input);
            logger.info(`user new session created, ${JSON.stringify(sessionCreated)}`);
            return sessionCreated.dataValues;
        } catch (error: any) {
            logger.info(`error while creating the session, ${JSON.stringify(error.message)}`);
            return error;
        }
    };
    async findSession(input: any) {
        const { userId } = input;
        try {
            const record = OperationalService.findOne(session, userId);
            return record;
        } catch (error: any) {
            return error.message
        }
    };
    async destroySession(id: string) {
        try {
            const result = await OperationalService.destroyOne(session, { where: { id } });
            logger.info(`Session deleted, ${JSON.stringify(result)}`)
            return result
        } catch (error: any) {
            logger.error(error.message)
        }
    }
}

export default new sessionService();
