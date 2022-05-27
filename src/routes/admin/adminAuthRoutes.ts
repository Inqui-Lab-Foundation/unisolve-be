import { Express } from 'express';
import AdminController from '../../controllers/admin.controllers';

//admin authentication
function routes(App: Express) {
    App.post('/api/v1/admin/register', AdminController.registerHandler);
    App.post('/api/v1/admin/login', AdminController.loginHandler);
    App.post('/api/v1/admin/changePassword', AdminController.changePasswordHandler);
    App.get('/api/v1/admin/logout', AdminController.logoutHandler);
    App.post('/api/v1/admin/setupStudentConfig', AdminController.createSignupConfig);
    App.get('/api/v1/admin/getStudentConfig', AdminController.getSignUpConfig);
}

export default routes;