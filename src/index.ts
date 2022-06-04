require('dotenv-safe').config({
    allowEmptyValues: true
});
import config from 'config'
import database from '../config/database.config'
import createServer from './utils/server';
import logger from './utils/logger';

// mySQL DB connection
database.sync()
    .then(() => logger.info("Connected to the Database successfully"))
    .catch((e: any) => {
        logger.error(`DB CONNECTIVITY ERROR: Message: ${e.message}.`);
        logger.error(`Error: ${e}`);
        logger.error(`Terminating the process with code:1, due to DB CONNECTIVITY ERROR.`);
        process.exit(1);
    });

// initialing the express application with createServer;
const PORT = config.get<number>('port');
const App = createServer();

// application listen
App.listen(PORT, async () => {
    logger.info(`App is running at http://${process.env.APP_HOST}:${PORT} or http://${process.env.APP_HOST_name}:${PORT}`);
})
