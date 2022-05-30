import { Express } from 'express';
import { studentPasswordSchema, studentRegisterSchema } from '../../payloadSchema/payloadShcemas';
import validate from '../../middleware/validateResource';
import verifyToken from '../../middleware/verifyToken';
import StudentController from '../../controllers/student.controllers';

function routes(App: Express) {
    // authentication
    App.post('/api/v1/student/register', validate(studentRegisterSchema), StudentController.registerHandler);
    App.post('/api/v1/student/login', StudentController.loginHandler);
    App.put('/api/v1/student/changePassword', validate(studentPasswordSchema), verifyToken, StudentController.changePasswordHandler);
    App.get('/api/v1/student/logout', StudentController.logoutHandler);
}

export default routes;