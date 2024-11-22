const helper = require("../helpers/helper");
const Subject = require("../models/Subject");
const SubjectData = require("../models/SubjectData");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

module.exports = {
    addSubject: async (req, res) => {
        try{
            const subject = await Subject.create(req.body);
            res.status(200).json({ message: 'Subject created successfully!' });
        } catch(err) {
            const errorResponse = helper.errorLog(err, 'SubjectService/addSubject');
            return res.status(400).send({errorResponse});
        }
    },
    getAllSubjects: async (req, res) => {
        try {
            const subjects = await Subject.find({})
                .select('_id subject_code subject_name sem course_id')
                .populate('course_id', 'course_name')
                .lean();

            if (!subjects || subjects.length === 0) {
                return res.status(200).json({ 
                    subjects: [],
                    message: "No subject found!" 
                });
            }
            // this response include course_name directly
            const transformedSubjects = subjects.map(subject => ({
                _id: subject._id,
                subject_code: subject.subject_code,
                subject_name: subject.subject_name,
                sem: subject.sem,
                course_id: subject.course_id._id,
                course_name: subject.course_id.course_name
            }));

            res.status(200).json({ subjects: transformedSubjects });
        } catch (err) {
            const errorResponse = helper.errorLog(err, 'SubjectService/getAllSubjects');
            return res.status(400).send({ errorResponse });
        }
    },
    updateSubject: async (req, res) => {
        try{
            const subject = await Subject.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            res.status(200).json({ message: 'Subject updated successfully!' });
        } catch(err) {
            const errorResponse = helper.errorLog(err, 'SubjectService/updateSubject');
            return res.status(400).send({errorResponse});
        }
    },
    addSubjectData: async (req, res) => {
        return new Promise((resolve, reject) => {
            // Always use multer to parse form data first
            upload(req, res, async function (err) {
                console.log('Request body after multer:', req.body);
                
                try {
                    // Handle multer errors
                    if (err instanceof multer.MulterError) {
                        reject({ status: 400, message: 'File upload error: ' + err.message });
                        return;
                    } else if (err) {
                        reject({ status: 400, message: err.message });
                        return;
                    }

                    // Check if this is a text-only update
                    if (req.body.text && !req.file) {
                        console.log('Processing text-only update');
                        const updateData = {
                            sub_id: req.body.sub_id,
                            title: req.body.title,
                            data: req.body.text
                        };

                        try {
                            // If id is provided, update existing document
                            if (req.body.id) {
                                await SubjectData.findByIdAndUpdate(
                                    req.body.id,
                                    updateData,
                                    { 
                                        new: true,
                                        runValidators: true
                                    }
                                );
                                res.status(200).json({ 
                                    message: 'Subject data updated successfully!'
                                });
                            } else {
                                // Create new document if no id provided
                                await SubjectData.create(updateData);
                                res.status(201).json({ 
                                    message: 'Subject data created successfully!'
                                });
                            }
                            resolve();
                        } catch (error) {
                            console.error("Error processing text update:", error);
                            if (error.name === 'ValidationError') {
                                return res.status(400).json({
                                    message: 'Validation Error',
                                    errors: error.errors
                                });
                            }
                            reject(error);
                        }
                    } 
                    // Handle file upload case
                    else if (req.file) {
                        console.log('Processing file upload');
                        // Validate required fields
                        if (!req.body.sub_id || !req.body.title) {
                            return res.status(400).json({ 
                                message: 'Missing required fields',
                                required: {
                                    sub_id: 'Subject ID is required',
                                    title: 'Title is required'
                                },
                                received: req.body
                            });
                        }

                        try {
                            // Read file content
                            const fileBuffer = fs.readFileSync(req.file.path);
                            
                            // Extract text based on file type
                            const extractedText = await extractText(fileBuffer, req.file.mimetype);

                            const updateData = {
                                sub_id: req.body.sub_id,
                                title: req.body.title,
                                data: extractedText
                            };

                            // Update if id provided, create if not
                            if (req.body.id) {
                                await SubjectData.findByIdAndUpdate(
                                    req.body.id,
                                    updateData,
                                    { 
                                        new: true,
                                        runValidators: true
                                    }
                                );
                                res.status(200).json({ 
                                    message: 'Subject data updated successfully!'
                                });
                            } else {
                                await SubjectData.create(updateData);
                                res.status(201).json({ 
                                    message: 'Subject data created successfully!'
                                });
                            }

                            // Clean up the temporary file
                            if (fs.existsSync(req.file.path)) {
                                fs.unlinkSync(req.file.path);
                            }

                            resolve();
                        } catch (error) {
                            console.error("Error processing file upload:", error);
                            // Clean up the temporary file in case of error
                            if (fs.existsSync(req.file.path)) {
                                fs.unlinkSync(req.file.path);
                            }
                            if (error.name === 'ValidationError') {
                                return res.status(400).json({
                                    message: 'Validation Error',
                                    errors: error.errors
                                });
                            }
                            throw error;
                        }
                    } else {
                        return res.status(400).json({ 
                            message: 'Please provide either text content or a file'
                        });
                    }
                } catch (err) {
                    console.error("Error in addSubjectData:", err);
                    reject(err);
                }
            });
        });
    }
}

// Function to extract text based on file type
async function extractText(buffer, mimetype) {
    let text = '';
    switch(mimetype) {
        case 'application/pdf':
            const pdfData = await pdfParse(buffer);
            text = pdfData.text;
            break;
        case 'text/plain':
            text = buffer.toString('utf-8');
            break;
        default:
            throw new Error('Unsupported file type. Only PDF and TXT files are currently supported.');
    }
    
    console.log('Original text:', text);
    
    // Only trim whitespace from start and end, preserve all internal formatting
    const final = text.trim();
    console.log('Final text:', final);
    
    return final;
}

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../public/uploads/temp/subjects');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = function (req, file, cb) {
    console.log('File upload attempt:', {
        originalname: file.originalname,
        mimetype: file.mimetype
    });

    // Accept PDF and TXT files
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'text/plain' ||
        file.originalname.toLowerCase().endsWith('.txt')) {
        
        // If it's a .txt file but mimetype isn't text/plain, override it
        if (file.originalname.toLowerCase().endsWith('.txt')) {
            file.mimetype = 'text/plain';
        }
        
        cb(null, true);
    } else {
        cb(new Error('Only PDF and TXT files are allowed'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('file');