import { get } from "lodash";
import config from 'config'
import { signJwt, verifyJwt } from "../utils/jwt";
import { session } from "../models/session.model";
import { student } from "../models/student.model";

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
        const newEntry = await session.create(input);
        return newEntry;
    };
    /**
     * 
     * @param param0 refresh token
     * @returns verify the token and return access token
     */
    async reIssuesAccessToken({ refreshToken }: { refreshToken: any }) {
        const { decoded } = verifyJwt(refreshToken);
        if (!decoded || get(decoded, "session")) return false;
        const record = await session.findByPk(get(decoded, "session"));
        if (!record || record.getDataValue('valid')) return false;
        const user = await student.findOne({ where: { id: record.getDataValue('userId') } });
        if (!user) return false;
        const accessToken = signJwt(
            { ...user, session: record.getDataValue('id') },
            { expiresIn: config.get("accessTokenTtl") } // 15 minutes
        );
        return accessToken;
    }
}

export default new sessionService();
