const fs = require('fs');
module.exports = {
    errorLog: (err, file="") => {
        fs.appendFile('./logs/error.log', `[${file}] ${new Date().toISOString()} - ${err.message}\n`, (writeErr) => {
            if (writeErr) {
                console.error('Failed to write to log file:', writeErr);
            }
        });
        if (err.errors) {
            // Extract the error messages into a readable format
            const errorMessages = Object.values(err.errors).map(error => ({
                field: error.path,
                message: error.message
            }));
            return { message: 'Validation failed', errors: errorMessages };
        }
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const value = err.keyValue[field];
            return {
                message: `Duplicate key error: The value '${value}' for '${field}' already exists.`,
                field: field,
                code: err.code
            };
        }
        //other errors
        return {message: 'An error occurred'};
    }
}