import Express, { Request, Response } from 'express';
import cors from 'cors';
import config from 'config';
import helmet from 'helmet';

import verifyToken from '../middleware/verifyToken';
import studentApiEndpoints from '../routes/student/studentAuthRoutes';
import adminApiEndpoints from '../routes/admin/adminAuthRoutes'
import protectedApiEndpoints from '../routes/routes';
import swaggerDocumentation from './swagger';
import healthCheckHandler from '../controllers/healthChecker.controller';

function createServer() {
    const app = Express();
    const Port = config.get<number>("port");
    // middleware's
    app.use(cors())
    app.use(helmet())//helmet for secure headers
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    // utils services
    swaggerDocumentation(app, Port);
    app.get('/api/v1/healthcheck', healthCheckHandler);
    adminApiEndpoints(app);
    studentApiEndpoints(app);
    app.use(verifyToken);
    protectedApiEndpoints(app);
    // wrong request
    app.use("*", (req: Request, res: Response) => {
        res.status(404).send({ message: "Page not found" })
    });
    return app;
}

export default createServer;


// todo:
// need to figure out the solution for wrong request.