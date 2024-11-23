const rateLimit = require('express-rate-limit');
const failedAttempts = new Map();

// Reset failed attempts after 15 minutes
const RESET_TIME = 15 * 60 * 1000;

// login limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 requests per windowMs
    message: { 
        message: 'Too many login attempts. Please try again after 15 minutes.' 
    },
    handler: (req, res, next, options) => {
        res.status(429).json(options.message);
    },
    keyGenerator: (req) => {
        return req.ip; // Use IP address as the key
    },
    skip: (req) => {
        return false;
    }
});

// Track failed attempts
const trackFailedAttempt = (ip) => {
    const attempts = failedAttempts.get(ip) || 0;
    failedAttempts.set(ip, attempts + 1);

    // Set timeout to reset attempts
    setTimeout(() => {
        failedAttempts.delete(ip);
    }, RESET_TIME);
};

// Get failed attempts
const getFailedAttempts = (ip) => {
    return failedAttempts.get(ip) || 0;
};

module.exports = {
    loginLimiter,
    trackFailedAttempt,
    getFailedAttempts
};
