import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import logger from './logger';
import { options } from '../docs/options'

/**
 * Swagger Ui application starter
 * @param app currently running express app
 * @param port septate port number other express app
 */
function swaggerDocs(app: Express, port: number) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(options));
    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(options);
    });
    logger.info(`Docs available at http://localhost:${port}/docs`);
};

export default swaggerDocs;