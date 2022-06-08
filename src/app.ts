import express, {
    Application,
    NextFunction,
    Request,
    Response
} from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from 'swagger-ui-express';
import path from "path";
import IController from "./interfaces/controller.interface";
import routeProtectionMiddleware from "./middlewares/routeProtection.middleware";
import healthCheckMiddleware from "./middlewares/healthCheck.middleware";
import logger from "./utils/logger";
import logIt from "./utils/logit.util";
import database from "./utils/dbconnection.util";
import { options } from "./docs/options";
import { speeches } from "./configs/speeches.config";
import * as errorHandler  from "./middlewares/errorHandler.middleware";
import { constents } from "./configs/constents.config";

export default class App {
    public app: Application;
    public port: number;
    public db: any;

    constructor(controllers: IController[], port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeHomeRoute();
        this.serveStaticFiles();
        this.initializeDocs();
        this.initializeHealthCheck();
        this.doLogIt(constents.log_levels.list.INBOUND);
        this.initializeRouteProtectionMiddleware();
        this.initializeControllers(controllers, "/api", "v1");
        this.initializeErrorHandling();//make sure this is the last thing in here 
        this.initializeDatabase();
        this.doLogIt(constents.log_levels.list.OUTBOUND);
    }
    private doLogIt(flag: string) {
        this.app.use(async (req: Request, res: Response, next: NextFunction) => {
            await logIt(flag, ((flag==constents.log_levels.list.INBOUND)? "Inbound request" : "Outbound responce"), req, res);
            next();
        });
    }

    private initializeDatabase(): void {
        database.sync()
            // .then(() => logger.info("Connected to the Database successfully"))
            .then(async () => {
                await logIt(constents.log_levels.list.INFO, "Connected to the Database successfully");
            })
            .catch(async (e: any) => {
                await logIt(constents.log_levels.list.ERROR, `DB CONNECTIVITY ERROR: Message: ${e}.`);
                await logIt(constents.log_levels.list.ERROR, `Terminating the process with code:1, due to DB CONNECTIVITY ERROR.`);
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
        this.app.get("/", (req: Request, res: Response, next: NextFunction) => {
            const resData = {
                status: 200,
                status_type: "success",
                apis: {
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
        this.app.use("/assets", express.static(path.join(process.cwd(), 'resources/static/uploads')));
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

    private initializeControllers(controllers: IController[], prefix: string = "/api", version: string = "v1"): void {
        controllers.forEach((controller: IController) => {
            this.app.use(`${prefix}/${version}`, controller.router);
        });
    }

    private initializeErrorHandling(): void {
        // Error Middleware
        this.app.use(errorHandler.genericErrorHandler);
        this.app.use(errorHandler.notFound);

        // Catch unhandled rejections
        this.app.use((req: Request, res:Response, next: NextFunction) => {
            process.on('UnhandledRejection', async err => {
                await logIt(constents.log_levels.list.ERROR, `Unhandled rejection. Error-object: ${err}`);
                res.send(err).end()
            });
        });
        
        // Catch uncaught exceptions
        this.app.use((req: Request, res:Response, next: NextFunction) => {
            process.on('Uncaught exception', async err => {;
                await logIt(constents.log_levels.list.ERROR, `Uncaught exception. Error-object: ${err}`);
                res.send(err).end()
            });
        });
    }

    private showRoutes(): void {
        var route, routes: any[] = [];
        this.app._router.stack.forEach(function (middleware: any) {
            if (middleware.route) { // routes registered directly on the app
                routes.push(middleware.route);
            } else if (middleware.name === 'router') { // router middleware 
                middleware.handle.stack.forEach(function (handler: any) {
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

    public  listen(): void {
        this.app.listen(this.port, async () => {
            await logIt(constents.log_levels.list.INFO, `App is running at http://${process.env.APP_HOST_NAME}:${this.port}`);

            if (process.env.SHOW_ROUTES === "true") {
                this.showRoutes();
            }

        });
    }

}