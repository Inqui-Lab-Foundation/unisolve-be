import { Request, Response, NextFunction } from 'express'

export default function dispatcher(data: any, status:string="success"): any{
        const resObj = {
            status: 200,
            status_type: 'success',
            message: 'OK',
            length: (data.length) ? data.length : 1,
            data: (data.length)? data : [data]
        }
        console.log(data.length)

        switch(status){
            case "created":
                resObj.status = 201;
                break;
            default:
                break;
        }

        return resObj;
    }
    