import Express, { Request, Response } from 'express';
import cors from 'cors';
import config from 'config';
import helmet from 'helmet';
import compression from 'compression';

import verifyToken from '../middleware/verifyToken';
import studentApiEndpoints from '../routes/student/studentAuthRoutes';
import adminApiEndpoints from '../routes/admin/adminAuthRoutes'
import routes from '../routes/routes';
import swaggerDocumentation from './swagger';
import healthCheckHandler from '../controllers/healthChecker.controller';
import shouldCompress from './compression';
import logger from './logger';
import * as errorHandler from '../middleware/errorHandler';
import path from 'path';

function createServer() {
    const app = Express();
    logger.info(`${process.env.APP_NAME} is starting...`);
    const Port = config.get<number>("port");
    
    app.use('/assets', Express.static(path.join(process.cwd(), 'resources')));
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
    // utils services
    swaggerDocumentation(app, Port);
    app.use(Express.urlencoded({ extended: true }));
    //routing
    app.get('/api/v1/healthcheck', healthCheckHandler);
    adminApiEndpoints(app);
    studentApiEndpoints(app);
    app.use(verifyToken);
    app.use('/api/v1', routes);
    // Error Middleware
    app.use(errorHandler.genericErrorHandler);
    app.use(errorHandler.notFound);
    
    return app;
}

export default createServer;
