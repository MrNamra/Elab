const fs = require('fs');
const path = require('path');

// Create required directories
const dirs = [
    path.join(__dirname, 'public/uploads', 'temp'),
    path.join(__dirname, 'logs')
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Create error.log file if it doesn't exist
const errorLogPath = path.join(__dirname, 'logs', 'error.log');
if (!fs.existsSync(errorLogPath)) {
    fs.writeFileSync(errorLogPath, '');
    console.log('Created error.log file');
}
