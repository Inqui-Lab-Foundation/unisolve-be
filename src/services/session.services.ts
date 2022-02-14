import { get } from "lodash";
import config from 'config'
import { signJwt, verifyJwt } from "@src/utils/jwt";
import { session } from "@src/models/session.model";
import { student } from "@src/models/student.model";

class sessionService {
    async createSession(input: any) {
        const newEntry = await session.create(input);
        return newEntry;
    };
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
