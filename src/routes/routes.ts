import Express, { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { options } from '../docs/options'
import healthCheckHandler from '../controllers/healthChecker.controller';
import protectRoute from '../middleware/protectroute.middleware';
import v1routes from './v1_routs/v1_routes';

// Default route
const router = Router();
router.get('/', (req: Request, res: Response) => {
    res.status(200).json(
        {
            status: 200,
            status_type: 'success',
            message: `Welcome to the Unisolve APIs`,
            urls:{
                docks: `http://${process.env.APP_HOST_name}:${process.env.APP_PORT}/docs`,
                apis: `http://${process.env.APP_HOST_name}:${process.env.APP_PORT}/api/`,
                healthcheck: `http://${process.env.APP_HOST_name}:${process.env.APP_PORT}/healthcheck`,
            }

        }
    )
});

//Public routes
// Static files Rout
router.use("/assets", Express.static(__dirname + '/resources'));

// Health Rout
router.use("/healthcheck", healthCheckHandler);

// Docs routes
router.use("/docs", swaggerUi.serve, swaggerUi.setup(options));
router.use("/docs.json", (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(options);
    res.end();
});

// Protected routes
// Validating the token
router.use(protectRoute);

// Application Routes
router.use("/api/v1", v1routes);

// wildcard route
// router.all("/*", (req: Request, res: Response) => {
//     res.status(404).json({ 
//         status: 404,
//         status_type: "error",
//         message: "Rout not found"
//     })
// });

export default router;