const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create the logs directory if it does not exist
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const logger = winston.createLogger({
    level: 'debug', // Log only if info.level <= this level
    format: winston.format.json(), // Use JSON format
    transports: [
        // Write all logs to `logs.log`
        new winston.transports.File({ filename: path.join(logDirectory, '/logs.log') }),
        // Write all logs error (and below) to `error.log`.
        new winston.transports.File({ filename: path.join(logDirectory, '/error.log'), level: 'error' })
    ]
});

// If we're not in production then also log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;
