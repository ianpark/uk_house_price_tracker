var fs = require('fs'),
    logger = require('winston');
const env = process.env.NODE_ENV || 'development';

var logDir = './log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
      timestamp: tsFormat,
      colorize: true,
      level: 'debug'
    });
logger.add(require('winston-daily-rotate-file'), {
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'debug'
    });

module.exports = logger;