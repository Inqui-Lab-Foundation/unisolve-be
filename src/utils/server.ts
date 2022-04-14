import Express, { Request, Response } from 'express';
import cors from 'cors';
import config from 'config';

import deserializerUser from '../middleware/deserializerUser';
import authRoutes from '../routes/authRoutes';
import routes from '../routes/routes';
import swaggerDocs from './swagger';


/**
 * create the express server when it's called.
 * @returns App
 */
function createServer() {
    const App = Express();
    const Port = config.get<number>("port");
    App.use(cors())
    App.use(Express.json());
    App.use(Express.urlencoded({ extended: true }));
    authRoutes(App);
    App.use(deserializerUser);
    routes(App);
    swaggerDocs(App, Port);
    App.use("*", (req: Request, res: Response) => {
        res.status(404).send({ message: "Page not found" })
    });
    return App;
}

export default createServer;