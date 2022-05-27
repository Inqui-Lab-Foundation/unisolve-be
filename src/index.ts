import config from 'config'
import database from '../config/database.config'
import createServer from './utils/server';
import logger from './utils/logger';

// initialing the express application with createServer;
const PORT = config.get<number>('port');
const App = createServer();

// mySQL DB connection
database.sync()
    .then(() => logger.info("Connected to the Database"))
    .catch((e: any) => logger.error(`Something went wrong, message: ${e.message}`));

// application listen
App.listen(PORT, async () => {
    logger.info(`App is running at http://localhost:${PORT}`);
})

// Catch unhandled rejections
process.on('unhandledRejection', err => {
    logger.error('Unhandled rejection', err);
  
    try {
    //   Sentry.captureException(err);
    } catch (err) {
      logger.error('Sentry error', err);
    } finally {
      process.exit(1);
    }
  });
  
  // Catch uncaught exceptions
  process.on('uncaughtException', err => {
    logger.error('Uncaught exception', err);
  
    try {
    //   Sentry.captureException(err);
    } catch (err) {
      logger.error('Sentry error', err);
    } finally {
      process.exit(1);
    }
  });