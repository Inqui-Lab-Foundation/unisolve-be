import { get } from "lodash";
import config from 'config'
import { signJwt, verifyJwt } from "../utils/jwt";
import { session } from "../models/session.model";
import { student } from "../models/student.model";
import dbServices from "./database.services";
import logger from '../utils/logger';

/**
 * service for all the user session controllers logic isolated
 */
class sessionService {
    /**
     * 
     * @param input as request body from the express application
     * @returns object after creating session
     */
    async createSession(input: any) {
        try {
            const newEntry = await dbServices.buildFunction(session, input);
            return newEntry.dataValues;
        } catch (error: any) {
            return error.message
        }
    };
    async findSession(input: any) {
        const { userId } = input;
        try {
            const record = dbServices.findOneFunction(session, { where: { userId } });
            return record;
        } catch (error: any) {
            return error.message
        }
    };
    async destroySession(data: string) {
        try {
            const result = dbServices.deleteFunction(session, { where: { userId: data } });
            logger.info(`Session deleted, ${JSON.stringify(result)}`)
            return result
        } catch (error: any) {
            logger.error(error.message)
        }
    }
    /**
     * 
     * @param param0 refresh token
     * @returns verify the token and return access token
     */
    async reIssuesAccessToken({ refreshToken }: { refreshToken: any }) {
        const { decoded } = verifyJwt(refreshToken);
        if (!decoded || get(decoded, "session")) return false;
        const record = await dbServices.findByPkFunction(session, get(decoded, "session"));
        if (!record || record.getDataValue('valid')) return false;
        const user = await dbServices.findOneFunction(student, { where: { id: record.getDataValue('userId') } });
        if (!user) return false;
        const accessToken = signJwt(
            { ...user, session: record.getDataValue('id') },
            { expiresIn: config.get("accessTokenTtl") } // 15 minutes
        );
        return accessToken;
    }

}

export default new sessionService();
