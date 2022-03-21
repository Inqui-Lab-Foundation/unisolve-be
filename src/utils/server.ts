import Express, { Request, Response } from 'express';
import cors from 'cors'
import deserializerUser from '../middleware/student/deserializerUser';
import routes from '../routes';
import swaggerDocs from './swagger';


/**
 * create the express server when it's called.
 * @returns App
 */
function createServer(Port: number) {
    const App = Express();
    App.use(Express.json());
    App.use(Express.urlencoded({ extended: true }));
    App.use(cors())
    App.use(deserializerUser);
    routes(App);
    swaggerDocs(App, Port);
    App.use("*", (req: Request, res: Response) => {
        res.status(404).send({ message: "Page not found" })
    })
    return App;
}

export default createServer;