import { Request, Response, NextFunction } from 'express'
import { speeches } from '../configs/speeches.config';

export default function dispatcher(data: any, status:string="success", message:string = "OK", status_code:number=200): any{
        const resObj:any = {
            status: status_code,
            status_type: 'success',
            message: message,
            count: (!data || typeof data === 'string') ? null : (data.length === undefined? 1:data.length),
            data: (data)?((data.length)? data : [data] ): data
        }

        switch(status){
            case "created":
                if(status_code==200) resObj.status = 201;
                break;
            case "error":
                if(status_code==200) resObj.status = 404;
                resObj.status_type = 'error';
                if (message== 'OK') resObj.message = speeches.DATA_NOT_FOUND;
                break;
            case "validation":
                if(status_code==200) resObj.status = 400;
                resObj.status_type = 'error';
                if (message== 'OK') resObj.message = speeches.DATA_NOT_FOUND;
                delete resObj.data;
                resObj.errors = data;
                break;
            default:
                break;
        }

        // await logIt(flag, ((flag==constents.log_levels.list.INBOUND)? "Inbound request" : "Outbound responce"), req, res);

        return resObj;
    }
    