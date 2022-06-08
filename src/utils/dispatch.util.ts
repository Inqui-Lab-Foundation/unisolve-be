import { Request, Response, NextFunction } from 'express'

export default function dispatcher(data: any, status:string="success", message:string = "OK"): any{
        const resObj:any = {
            status: 200,
            status_type: 'success',
            message: message,
            count: (!data || data.length === undefined || typeof data.length === 'string') ? null : data.length,
            data: (data)?((data.length)? data : [data] ): data
        }

        switch(status){
            case "created":
                resObj.status = 201;
                break;
            case "error":
                resObj.status = 404;
                resObj.status_type = 'error';
                resObj.message = 'Data not found';
                break;
            case "validation":
                resObj.status = 400;
                resObj.status_type = 'error';
                if (message== 'OK') resObj.message = 'Data not found';
                delete resObj.data;
                resObj.errors = data;
                break;
            default:
                break;
        }

        return resObj;
    }
    