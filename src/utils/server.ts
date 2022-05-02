import Express, { Request, Response } from 'express';
import cors from 'cors';
import config from 'config';

import verifyToken from '../middleware/verifyToken';
import studentAuthRoutes from '../routes/student/studentAuthRoutes';
import adminRoutes from '../routes/admin/adminAuthRoutes'
import routes from '../routes/routes';
import swaggerDocs from './swagger';
import db from '../../config/database.config';
import { log } from '../models/log';
import operationalServices from '../services/operational.services';

// isolated express application
function createServer() {

    const app = Express();
    const Port = config.get<number>("port"); // gets the port number

    // middleware's
    app.use(cors())
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    swaggerDocs(app, Port); // swagger UI
    app.get('/api/v1/healthcheck', async (req: Request, res: Response) => {
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            DatabaseStatus: '',
            timestamp: Date.now()
        };
        try {
            await db.authenticate().then(() => healthcheck.DatabaseStatus = 'Active');
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(healthcheck)}`,
                status: 'success'
            });
            res.status(200).send(healthcheck);
        } catch (error: any) {
            healthcheck.message = error;
            res.status(503).send(error);
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(error.message)}`,
                status: 'failed'
            });
        }
    });
    adminRoutes(app);
    studentAuthRoutes(app);
    // app.use(verifyToken); // verify the token and save the res to locals
    routes(app); // protected routing
    app.use("*", (req: Request, res: Response) => {
        res.status(404).send({ message: "Page not found" })
    }); // responding with "page not found" if the API's is not found

    return app;
}

export default createServer;