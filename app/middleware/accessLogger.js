const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

// Custom token for response time in milliseconds
morgan.token('response-time-ms', function (req, res) {
    return res.getHeader('x-response-time');
});

// Custom format string
const logFormat = ':remote-addr -> :method :url :status :response-time-ms ms - :res[content-length] bytes - :user-agent - [:date[clf]]';

// Response time middleware
const responseTime = (req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const duration = process.hrtime(start);
        const timeInMs = duration[0] * 1000 + duration[1] / 1e6;
        res.setHeader('x-response-time', timeInMs.toFixed(2));
    });
    next();
};

// Create a write stream for today's log file
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`),
    { flags: 'a' }
);

// Logger middleware
const accessLogger = morgan(logFormat, { stream: accessLogStream });

module.exports = { accessLogger };
