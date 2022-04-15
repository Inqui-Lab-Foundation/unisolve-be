import { Express } from 'express';
import authControllers from '../controllers/auth.controllers';
import { userRegisterSchema } from '../schemas/student.schema';
import validate from '../middleware/validateResource';

//authentication API's
function routes(App: Express) {
    //Health checking
    App.get('/api/v1/healthcheck', authControllers.healthCheck);
    //User authentication
    App.post('/api/v1/auth/register', validate(userRegisterSchema), authControllers.registerHandler);
    App.post('/api/v1/auth/login', authControllers.loginHandler);
    App.get('/api/v1/auth/logout', authControllers.logoutHandler);
}

export default routes;