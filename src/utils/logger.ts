import logger from 'pino';
import dayjs from 'dayjs';

/**
 * logger service from pino package
 * @param no parameters.
 * @return log message with timestamp.
 */
const log = logger({
    prettyPrint: true,
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format()}"`
});

export default log;