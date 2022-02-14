/*Importing the dependencies*/
import jwt from 'jsonwebtoken';
import config from 'config';

/**
 * Constants: 
 * pre generated Private Key with help of
 * pre generated Public Key with help of
 */
const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

/**
 * function generates Jwt token.
 * @param object user, session details as a object.
 * @param options default set to jwt.signOption object or expected to pass expired time.
 * @returns Jwt token.
 */
export function signJwt(object: object, options?: jwt.SignOptions | undefined
) {
    return jwt.sign(object, `${privateKey}`, { ...(options && options), algorithm: "RS256" });
};

/**
 * function verify jwt token.
 * @param token generated token
 * @returns object = { validity: boolean, expire: boolean, decoded token: string }
 * @throws object = { validity: boolean, expire: string, decoded token: null }
 */
export function verifyJwt(token: string) {
    try {
        const decoded = jwt.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded
        }
    } catch (error: any) {
        return {
            valid: false,
            expired: error.message === 'JWT expired',
            decoded: null
        }
    }
};