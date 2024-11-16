const helper = require("../../helpers/helper");
const studentService = require("../../services/studentService");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/temp directory exists
const uploadDir = path.join(__dirname, '../../../public/uploads/temp');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Add timestamp to prevent filename conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'students-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check file type
        if (file.mimetype !== 'text/csv' && path.extname(file.originalname).toLowerCase() !== '.csv') {
            return cb(new Error('Only CSV files are allowed!'));
        }

        // Check if file is empty
        if (parseInt(req.headers['content-length']) <= 0) {
            return cb(new Error('Empty files are not allowed!'));
        }

        cb(null, true);
    }
});

module.exports = {
    addStudents: (req, res) => {
        upload.single('file')(req, res, async function (err) {
            try {
                // Handle multer errors
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'File upload error: ' + err.message });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }

                // Check if file exists
                if (!req.file) {
                    return res.status(400).json({ message: 'Please upload a CSV file' });
                }

                // Pass to service
                await studentService.addStudents(req, res);
            } catch (err) {
                // Clean up uploaded file in case of error
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                
                const errorResponse = helper.errorLog(err, 'StudentController/addStudents');
                res.status(400).send({ errorResponse });
            }
        });
    },
    addStudent: async (req, res) => {
        try {
            await studentService.addStudent(req, res);
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'StudentController/addStudent');
            res.status(400).send({ errorResponse });
        }
    },
    editStudent: async (req, res) => {
        try {
            await studentService.editStudent(req, res);
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'StudentController/editStudent');
            res.status(400).send({ errorResponse });
        }
    },
    promoteDemoteStudents: (req, res) => {
        try {
            studentService.promoteDemoteStudents(req, res);
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'StudentController/promoteStudents');
            res.status(400).send({ errorResponse });
        }
    }
};