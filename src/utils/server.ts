import Express, { Request, Response } from 'express';
import cors from 'cors';
import config from 'config';

import verifyToken from '../middleware/verifyToken';
import studentAuthRoutes from '../routes/student/studentAuthRoutes';
import adminRoutes from '../routes/admin/adminAuthRoutes'
import routes from '../routes/routes';
import swaggerDocs from './swagger';

// isolated express application
function createServer() {

    const app = Express();
    const Port = config.get<number>("port"); // gets the port number

    // middleware's
    app.use(cors())
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    swaggerDocs(app, Port); // swagger UI
    app.get('/api/v1/healthcheck', (req: Request, res: Response) => {
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        };
        try {
            res.send(healthcheck);
        } catch (error: any) {
            healthcheck.message = error;
            res.status(503).send(error);
        }
    });
    adminRoutes(app);
    studentAuthRoutes(app);
    app.use(verifyToken); // verify the token and save the res to locals
    routes(app); // protected routing
    app.use("*", (req: Request, res: Response) => {
        res.status(404).send({ message: "Page not found" })
    }); // responding with "page not found" if the API's is not found

    return app;
}

export default createServer;