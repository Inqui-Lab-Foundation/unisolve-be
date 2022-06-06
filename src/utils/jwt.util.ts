import HttpException from "./exceptions/http.exception";
import jwt from "jsonwebtoken";
import { speeches } from "../configs/speeches.config";

class JwtUtil{

    async createToken(data = {}, key:any= process.env.PRIVATE_KEY){
        if(Object.keys(data).length){
            try{
                return jwt.sign(data, key, {
                    expiresIn: process.env.TOKEN_DEFAULT_TIMEOUT 
                });
            }catch(err){
                // throw new HttpException(404, speeches.UNABLE_TO_CREATE_TOKEN, err);
                return new Promise((resolve, reject)=>{
                    reject(err);
                });
            }
            
        }else{
            throw new HttpException(404, speeches.INVALID_DATA_SEND_TO_CREATE_TOKEN);
        }
    }

    async validateToken(token: string){
        try{
            // @ts-ignore
            return jwt.verify(token, process.env.PUBLIC_KEY,(err:any, result:any)=>{
                return new Promise((resolve, reject)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            });
        }catch(err){
            return new Promise((resolve, reject)=>{
                reject(err);
            });
        }
    }

}

export default new JwtUtil();