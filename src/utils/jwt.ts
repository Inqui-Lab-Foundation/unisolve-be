import jwt from 'jsonwebtoken';
import config from 'config';

// constants
const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

//wrapper function for sign
export function signJwt(object: object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, `${privateKey}`, { ...(options && options), algorithm: "RS256" });
};

//wrapper function for verify
export function verifyJwt(token: string): Promise<any> {
    return new Promise((resolve, reject)=>{ 
        jwt.verify(token, `${publicKey}`,(err, result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    });
};