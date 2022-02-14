import { Express, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
import logger from './logger';

// define Swagger options with specific properties
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Unislove API Docs",
            description: "Unislove backend applications api documentation with in details API description",
            version,
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes.ts", "./src/schema/*.ts"],
};

// passing swagger option to swaggerJSdoc built-in function
const swaggerSpec = swaggerJSDoc(options);

/**
 * Swagger Ui application starter
 * @param app currently running express app
 * @param port septate port number other express app
 */
function swaggerDocs(app: Express, port: number) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    logger.info(`Docs available at http://localhost:${port}/docs`);
};

export default swaggerDocs;