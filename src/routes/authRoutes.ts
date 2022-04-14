import { Express, Request, Response } from 'express';
import authControllers from '../controllers/auth.controllers';
import { userRegisterSchema } from '../schemas/student.schema';
import validate from '../middleware/validateResource';

function routes(App: Express) {
    //health checking api
    App.get('/api/v1/healthCheck', (req: Request, res: Response) => {
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

    //authentication
    App.post('/api/v1/auth/register', validate(userRegisterSchema), authControllers.registerHandler);
    App.post('/api/v1/auth/login', authControllers.loginHandler);
    App.get('/api/v1/auth/logout', authControllers.logoutHandler);
}

export default routes;