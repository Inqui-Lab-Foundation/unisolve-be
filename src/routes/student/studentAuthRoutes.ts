import { Express } from 'express';
import authControllers from '../../controllers/student.controllers';
import { studentPasswordSchema, studentRegisterSchema } from '../../schemas/student.schema';
import validate from '../../middleware/validateResource';

//authentication API's
function routes(App: Express) {
    //student authentication
    App.post('/api/v1/student/register', validate(studentRegisterSchema), authControllers.registerHandler);
    App.post('/api/v1/student/login', authControllers.loginHandler);
    App.post('/api/v1/student/changePassword', validate(studentPasswordSchema), authControllers.changePasswordHandler);
    App.get('/api/v1/student/logout', authControllers.logoutHandler);
}

export default routes;