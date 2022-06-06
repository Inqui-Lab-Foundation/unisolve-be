import { Request, Response, NextFunction } from 'express'

export default function dispatcher(data: any, status:string="success"): any{
        const resObj = {
            status: 200,
            status_type: 'success',
            message: 'OK',
            count: (data.length === undefined) ? 1: data.length,
            data: (data.length)? data : [data]
        }

        switch(status){
            case "created":
                resObj.status = 201;
                break;
            default:
                break;
        }

        return resObj;
    }
    