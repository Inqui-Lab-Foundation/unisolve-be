import { Router, Request, Response, NextFunction} from 'express';
import IController from '../interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import validationMiddleware from '../middlewares/validation.middleware';
import authValidations from '../validations/auth.validations';
import CRUDService from '../services/crud.service';
import jwtUtil from '../utils/jwt.util';
import logger from '../utils/logger';

export default class NotificationsController implements IController {
    public path: string;
    public router: Router;
    crudService:CRUDService = new CRUDService;

    constructor() {
        this.path = '/notifications';
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.get(`${this.path}/stream`, this.stream);
    }

    private loadModel = async (model:string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${model}.model`);
        return modelClass[model];
    }

    private stream = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        // It is recommended to use other queue services like rabbitmq, kafka, etc.
        // TODO: Replace this SSE with a queue service
        try {
            res.set({
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream",
            });
            res.flushHeaders();

            // start stream
            const tickTime = <number><unknown>process.env.STREAM_INTERVAL || 5000
            const streamInterval = setInterval(() => {
                const data = {
                    id: Math.floor(Math.random() * 100),
                    message: 'Hello world',
                    date: new Date().toLocaleString()
                };
                console.log(data)
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            }, tickTime);

            // closing strem
            req.on('close', () => {
                clearInterval(streamInterval);
            });

        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
}