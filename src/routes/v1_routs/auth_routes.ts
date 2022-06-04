import { Router } from 'express';
import authController from '../../controllers/v1/auth.controller';

// Default route
const auth_routes = Router();
auth_routes.post("/register", authController.registerUser);
auth_routes.post("/login", authController.login);
auth_routes.post("/change_password", authController.changePassword);
auth_routes.get("/logout", authController.logout);
auth_routes.post("/setup_student_onfig", authController.createSignupConfig);
auth_routes.get("/get_student_onfig", authController.getSignUpConfig);

export default auth_routes;