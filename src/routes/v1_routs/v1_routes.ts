import { Router } from 'express';
import auth_routes from './auth_routes';

// Default route
const v1routes = Router();
v1routes.use("/auth", auth_routes)

export default v1routes;