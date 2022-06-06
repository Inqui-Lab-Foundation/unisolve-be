import express, { 
    Application, 
    NextFunction ,
    Request,
    Response
} from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from 'swagger-ui-express';
import { Sequelize } from "sequelize";
import path from "path";
import IController from "./interfaces/controller.interface";
import errorMiddleware from "./middlewares/error.middleware";
import routeProtectionMiddleware from "./middlewares/routeProtection.middleware";
import healthCheckMiddleware from "./middlewares/healthCheck.middleware";
import logger from "./utils/logger";
import database from "./utils/dbconnection.util";
import { options } from "./docs/options";
import { speeches } from "./configs/speeches.config";
import * as errorHandler  from "./middlewares/error_handler.middleware";

export default class App {
    public app: Application;
    public port: number;
    public db: any;

    constructor(controllers: IController[], port: number) {
        this.app = express();
        this.port = port;
        
        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeHomeRoute();
        this.serveStaticFiles();
        this.initializeDocs();
        this.initializeHealthCheck();
        // this.initializeRouteProtectionMiddleware();
        this.initializeControllers(controllers, "/api", "v1");
        this.initializeErrorHandling();//make sure this is the last thing in here 
    }
    
    private initializeDatabase(): void {
        database.sync()
            .then(() => logger.info("Connected to the Database successfully"))
            .catch((e: any) => {
                logger.error(`DB CONNECTIVITY ERROR: Message: ${e.message}.`);
                logger.error(`Error: ${e}`);
                logger.error(`Terminating the process with code:1, due to DB CONNECTIVITY ERROR.`);
                process.exit(1);
            });
    }

    private initializeMiddlewares(): void {
        this.app.use(helmet());   // helmet for secure headers
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(compression()); // compression for gzip
    }

    private initializeHomeRoute(): void {
        this.app.get("/", (req: Request, res: Response, next:NextFunction) => {
            const resData = {
                status: 200,
                status_type: "success",
                apis:{
                    docks: `http://${process.env.APP_HOST_name}:${process.env.APP_PORT}/docs`,
                    apis: `http://${process.env.APP_HOST_name}:${process.env.APP_PORT}/api/v1`,
                    healthcheck: `http://${process.env.APP_HOST_name}:${process.env.APP_PORT}/healthcheck`,
                },
            }
            res.status(resData.status).send(resData);
            next();
        });
    }

    private serveStaticFiles(): void {
        this.app.use("/assets",express.static(path.join(__dirname, "..", "assets")));
    }

    private initializeDocs(): void {
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(options));
        this.app.use("/docs.json", (req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(options);
            next();
        });
    }

    private initializeHealthCheck(): void {
        this.app.get("/healthcheck", healthCheckMiddleware);
    }

    private initializeRouteProtectionMiddleware(): void {
        this.app.use(routeProtectionMiddleware);
    }

    private initializeControllers(controllers: IController[], prefix: string = "/api", version:string = "v1"): void {
        controllers.forEach((controller: IController) => {
            this.app.use(`${prefix}/${version}`, controller.router);
        });
    }

    private initializeErrorHandling(): void {
        // Error Middleware
        this.app.use(errorHandler.genericErrorHandler);
        this.app.use(errorHandler.notFound);

        // Catch unhandled rejections
        process.on('unhandledRejection', err => {
            logger.error('Unhandled rejection', err);
        
            try {
            //   Sentry.captureException(err);
            } catch (err) {
            logger.error('Sentry error', err);
            } finally {
            // process.exit(1);
            }
        });
        
        // Catch uncaught exceptions
        process.on('uncaughtException', err => {
            logger.error('Uncaught exception', err);
        
            try {
            //   Sentry.captureException(err);
            } catch (err) {
            logger.error('Sentry error', err);
            } finally {
            // process.exit(1);
            }
        });
    }

    private showRoutes(): void {
        var route, routes: any[] = [];
        this.app._router.stack.forEach(function(middleware:any){
            if(middleware.route){ // routes registered directly on the app
                routes.push(middleware.route);
            } else if(middleware.name === 'router'){ // router middleware 
                middleware.handle.stack.forEach(function(handler:any){
                    route = handler.route;
                    route && routes.push(route);
                });
            }
        });
        console.log(
`=================================================================
Available Routes:
=================================================================`);
        console.log(`Base Path: http://localhost:${this.port}/api/v1`);
        console.table(routes);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            logger.info(`App is running at http://localhost:${this.port}`);
            
            if(process.env.SHOW_ROUTES === "true") {
                this.showRoutes();
            }
            
        });
    }

}