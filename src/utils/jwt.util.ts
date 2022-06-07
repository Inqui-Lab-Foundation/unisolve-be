import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import HttpException from "./exceptions/http.exception";
import { speeches } from "../configs/speeches.config";
import path from "path";

class JwtUtil{

    async createToken(data = {}, key:any= process.env.PRIVATE_KEY){
        if(Object.keys(data).length){
            try{
                var privateKEY  = readFileSync(path.join(process.cwd(), process.env.PUBLIC_KEY || "keys/jwtRS256.pem"), 'utf8');
                return jwt.sign(data, privateKEY, {
                    expiresIn: process.env.TOKEN_DEFAULT_TIMEOUT,
                    algorithm: "HS256" 
                });
            }catch(err){
                // throw new HttpException(404, speeches.UNABLE_TO_CREATE_TOKEN, err);
                return new Promise((resolve, reject)=>{
                    reject(err);
                });
            }
            
        }else{
            throw new HttpException(500, speeches.INVALID_DATA_SEND_TO_CREATE_TOKEN);
        }
    }

    async validateToken(token: string){
        try{
            const publicKEY  = readFileSync(path.join(process.cwd(), process.env.PRIVATE_KEY || "keys/jwtRS256.pem"), 'utf8');
            return new Promise((resolve, reject)=>{
                jwt.verify(
                    token, 
                    publicKEY,(err:any, result:any)=>{
                        if(err){
                            reject(err);
                        }else{
                            resolve(result);
                        }
                });
            })
        }catch(err){
            return new Promise((resolve, reject)=>{
                console.log("-------------------------------------");
                reject(err);
            });
        }
    }

}

export default new JwtUtil();