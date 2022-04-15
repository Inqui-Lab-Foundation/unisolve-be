import Express, { Request, Response } from 'express';
import cors from 'cors';
import config from 'config';

import verifyToken from '../middleware/verifyToken';
import authRoutes from '../routes/authRoutes';
import routes from '../routes/routes';
import swaggerDocs from './swagger';

// isolated express application
function createServer() {
    const App = Express();
    const Port = config.get<number>("port");
    App.use(cors())
    App.use(Express.json());
    App.use(Express.urlencoded({ extended: true }));
    authRoutes(App);
    swaggerDocs(App, Port);
    App.use("*", (req: Request, res: Response) => {
        res.status(404).send({ message: "Page not found" })
    });
    App.use(verifyToken);
    routes(App);
    return App;
}

export default createServer;