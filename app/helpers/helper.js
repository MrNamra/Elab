const fs = require('fs');
module.exports = {
    errorLog: (err, file="") => {
        fs.appendFile('./logs/error.log', `[${file}] ${new Date().toISOString()} - ${err.message}\n`, (writeErr) => {
            if (writeErr) {
                console.error('Failed to write to log file:', writeErr);
            }
        });
    }
}