import express from "express";
import config from 'config'

import db from '../config/database.config'
import createServer from './utils/server';
import logger from './utils/logger';
import swaggerDocs from './utils/swagger';

const App = createServer();
const PORT = config.get<number>('port');

console.log(PORT);

db.sync()
    .then(() => logger.info("connected to database"))
    .catch((e) => logger.error(`Something went wrong, message: ${e.message}`));

App.listen(PORT, async () => {
    logger.info(`App is running at http://localhost:${PORT}`);
    swaggerDocs(App, PORT);
})
