import compression from 'compression';
import { Request, Response, NextFunction } from "express";
import { get } from "lodash";

export const  resCompress =  (req:Request, res:Response) => {
  const headerCompression = get(req,'headers.x-no-compression',{});
    if (headerCompression) {
      // don't compress responses with this request header
      return false
    }
  
    // fallback to standard filter function
    return compression.filter(req, res)
  }
