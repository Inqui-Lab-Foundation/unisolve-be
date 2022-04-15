import { get } from "lodash";
import config from 'config'
import { signJwt, verifyJwt } from "../utils/jwt";
import { session } from "../models/session.model";
import { student } from "../models/student.model";
import OperationalService from "./operational.services";
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
            const newEntry = await OperationalService.build(session, input);
            return newEntry.dataValues;
        } catch (error: any) {
            return error.message
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
            const result = OperationalService.destroyOne(session, {
                where: { id }
            });
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
    // async reIssuesAccessToken({ refreshToken }: { refreshToken: any }) {
    //     const { decoded } = verifyJwt(refreshToken);
    //     if (!decoded || get(decoded, "session")) return false;
    //     const record = await OperationalService.findByPk(session, get(decoded, "session"));
    //     if (!record || record.getDataValue('valid')) return false;
    //     const user = await OperationalService.findOne(student, record.getDataValue('userId'));
    //     if (!user) return false;
    //     const accessToken = signJwt(
    //         { ...user, session: record.getDataValue('id') },
    //         { expiresIn: config.get("accessTokenTtl") } // 15 minutes
    //     );
    //     return accessToken;
    // }

}

export default new sessionService();
