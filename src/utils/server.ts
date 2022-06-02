import Express, { Request, Response } from 'express';
import cors from 'cors';
import config from 'config';
import helmet from 'helmet';
import compression from 'compression';

import verifyToken from '../middleware/verifyToken';
import studentApiEndpoints from '../routes/student/studentAuthRoutes';
import adminApiEndpoints from '../routes/admin/adminAuthRoutes'
import protectedApiEndpoints from '../routes/routes';
import swaggerDocumentation from './swagger';
import healthCheckHandler from '../controllers/healthChecker.controller';
import shouldCompress from './compression';
import path from 'path';

function createServer() {
    const app = Express();
    const Port = config.get<number>("port");
    
    // middleware's
    app.use(cors())
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization")
        next();
    });
    app.use(helmet())//helmet for secure headers
    app.use(compression({ filter: shouldCompress }))//compression for gzip
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    // utils services
    swaggerDocumentation(app, Port);
    //routing
    app.use('/assets', Express.static(path.join(process.cwd(), 'resources')));
    app.get('/api/v1/healthcheck', healthCheckHandler);
    adminApiEndpoints(app);
    studentApiEndpoints(app);
    app.use(verifyToken);
    protectedApiEndpoints(app);
    // wrong request
    app.use("*", (req: Request, res: Response) => {
        res.status(404).json({ message: "Page not found" })
    });
    return app;
}

export default createServer;