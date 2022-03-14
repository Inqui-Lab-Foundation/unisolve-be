import Express from 'express';
import cors from 'cors'
import deserializerUser from '../middleware/student/deserializerUser';
import routes from '../routes';

/**
 * middleware's
 * expressJSON to parse the JSON
 * Deserializer help in application authorization 
 */

function createServer() {
    const App = Express();
    App.use(Express.json());
    App.use(Express.urlencoded({ extended: true }));
    App.use(cors())
    App.use(deserializerUser);
    routes(App);
    return App;
}

export default createServer;