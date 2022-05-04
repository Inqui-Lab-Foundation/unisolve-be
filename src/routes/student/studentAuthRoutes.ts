import { Express } from 'express';
import authControllers from '../../controllers/student.controllers';
import { studentPasswordSchema, studentRegisterSchema } from '../../payloadSchema/payloadShcemas';
import validate from '../../middleware/validateResource';
import verifyToken from '../../middleware/verifyToken';

//authentication API's
function routes(App: Express) {
    //student authentication
    App.post('/api/v1/student/register', validate(studentRegisterSchema), authControllers.registerHandler);
    App.post('/api/v1/student/login', authControllers.loginHandler);
    App.post('/api/v1/student/changePassword', validate(studentPasswordSchema), verifyToken, authControllers.changePasswordHandler);
    App.get('/api/v1/student/logout', authControllers.logoutHandler);
}

export default routes;