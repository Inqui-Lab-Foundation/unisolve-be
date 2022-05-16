import config from 'config'
import db from '../config/database.config'
import createServer from './utils/server';
import logger from './utils/logger';

// initialing the express application with createServer;
const PORT = config.get<number>('port');
const App = createServer();

// mySQL DB connection
db.sync()
    .then(() => logger.info("Connected to the Database"))
    .catch((e: any) => logger.error(`Something went wrong, message: ${e.message}`));

// application listen
App.listen(PORT, async () => {
    logger.info(`App is running at http://localhost:${PORT}`);
})
