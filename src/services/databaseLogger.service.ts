import { logToDatabase } from "../models/log";
import { Request } from "express";
import operationalServices from "./operational.services";

async function storeLogsToDatabase(req: Request, storeDetailsToDatabase: object, status: String) {
    await operationalServices.build(logToDatabase, {
        api_name: req.originalUrl,
        request_method: req.method,
        request: `${JSON.stringify(req.body)}`,
        response: `${JSON.stringify(storeDetailsToDatabase)}`,
        status
    });
}

export default storeLogsToDatabase;