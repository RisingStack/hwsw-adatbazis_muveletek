const winston = require('winston');
const { logLevel } = require('./config');

const logger = winston.createLogger({
  level: logLevel,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

module.exports = logger;
