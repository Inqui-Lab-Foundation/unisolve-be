import { Request, Response } from "express";
import database from "../../config/database.config";
import storeLogsToDatabase from "../services/databaseLogger.service";

const healthCheckHandler = async (req: Request, res: Response) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        DatabaseStatus: '',
        timestamp: Date.now()
    };
    try {
        await database.authenticate().then(() => healthcheck.DatabaseStatus = 'Active');
        storeLogsToDatabase(req, healthcheck, 'success')
        res.status(200).send(healthcheck);
    } catch (error: any) {
        healthcheck.message = error;
        storeLogsToDatabase(req, error.message, 'fai;ed')
        res.status(503).send(error);
    }
}

export default healthCheckHandler;