const helper = require("../helpers/helper");
const Student = require("../models/Students");
const Course = require("../models/Course");
const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const { addStudents } = require("../controllers/Admin/StudentController");

module.exports = {
    addStudents: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Please upload a CSV file' });
            }

            const results = [];
            let hasError = false;
            
            // Read CSV file and parse data
            await new Promise((resolve, reject) => {
                fs.createReadStream(req.file.path)
                    .pipe(csv())
                    .on('data', (data) => {
                        // Clean the data object by removing empty fields and trimming values
                        const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
                            const trimmedValue = value.trim();
                            if (trimmedValue !== '') {
                                acc[key.trim()] = trimmedValue;
                            }
                            return acc;
                        }, {});
                        
                        if (Object.keys(cleanedData).length > 0) {
                            results.push(cleanedData);
                        }
                    })
                    .on('error', (error) => {
                        hasError = true;
                        reject(error);
                    })
                    .on('end', resolve);
            });

            // Remove CSV file after reading
            fs.unlinkSync(req.file.path);

            if (hasError) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Error reading CSV file' });
            }

            if (results.length === 0) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'CSV file is empty' });
            }

            // Get all enrollment numbers from CSV
            const enrollmentNumbers = results.map(row => row.enrollment_no);

            // Check for duplicate enrollment numbers within CSV
            const duplicatesInCSV = enrollmentNumbers.filter((item, index) => enrollmentNumbers.indexOf(item) !== index);
            if (duplicatesInCSV.length > 0) {
                await session.abortTransaction();
                return res.status(400).json({
                    message: 'Duplicate enrollment numbers found in CSV',
                    duplicates: [...new Set(duplicatesInCSV)]
                });
            }

            // Check for existing enrollment numbers in database
            const existingStudents = await Student.find({
                en_no: { $in: enrollmentNumbers }
            }).select('en_no');

            if (existingStudents.length > 0) {
                await session.abortTransaction();
                return res.status(400).json({
                    message: 'Some enrollment numbers already exist in database',
                    existing: existingStudents.map(student => student.en_no)
                });
            }

            // Validate all data before inserting
            const studentsToInsert = [];
            const validationErrors = [];

            // Get all courses once
            const courses = await Course.find({}).lean();
            const courseMap = new Map(courses.map(course => [course.course_name.toLowerCase(), course._id]));

            for (const row of results) {
                try {
                    // Find course_id by course name
                    const courseName = row.Cource.trim();
                    const course_id = courseMap.get(courseName.toLowerCase());
                    
                    if (!course_id) {
                        throw new Error(`Course: ${courseName} not found`);
                    }

                    const student = new Student({
                        en_no: row.enrollment_no,
                        name: row.name,
                        ip: row.ip || null,
                        course_id: course_id,
                        sem: row.Sem,
                        div: row.DIV
                    });
                    
                    // Validate but don't save yet
                    await student.validate();
                    studentsToInsert.push(student);
                } catch (err) {
                    validationErrors.push({
                        enrollment_no: row.enrollment_no || 'Unknown',
                        error: err.message
                    });
                }
            }

            // If any validation errors, abort transaction
            if (validationErrors.length > 0) {
                await session.abortTransaction();
                return res.status(400).json({
                    message: 'Validation errors found',
                    errors: validationErrors
                });
            }

            // Insert all students in a transaction
            try {
                // Use ordered: false to continue inserting even if some documents fail
                await Student.insertMany(studentsToInsert, { 
                    session,
                    ordered: true // Keep true to ensure all-or-nothing insertion
                });
                
                await session.commitTransaction();
                
                res.status(200).json({ 
                    message: 'All students added successfully!',
                    count: studentsToInsert.length 
                });
            } catch (err) {
                await session.abortTransaction();
                throw err;
            }

        } catch (err) {
            await session.abortTransaction();
            const errorResponse = helper.errorLog(err, 'StudentService/addStudents');
            return res.status(400).send({ errorResponse });
        } finally {
            session.endSession();
            // Ensure CSV file is removed if it exists
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }
    },
    addStudent: async (req, res) => {
        try{
            const student = await Student.create(req.body);
            res.status(200).json({ message: 'Student created successfully!' });
        } catch(err) {
            const errorResponse = helper.errorLog(err, 'StudentService/addStudent');
            return res.status(400).send({errorResponse});
        }
    },
    editStudent: async (req, res) => {
        try{
            const student = await Student.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            res.status(200).json({ message: 'Student updated successfully!' });
        } catch(err) {
            const errorResponse = helper.errorLog(err, 'StudentService/editStudent');
            return res.status(400).send({errorResponse});
        }
    },
    promoteDemoteStudents: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { action = 'promote' } = req.body; // 'promote' or 'demote'
            const increment = action === 'promote' ? 1 : -1;

            // Find all students and group them by semester
            const students = await Student.find({}).select('sem');
            const semesterGroups = students.reduce((acc, student) => {
                const sem = parseInt(student.sem);
                if (!acc[sem]) acc[sem] = [];
                acc[sem].push(student._id);
                return acc;
            }, {});

            const updates = [];
            const errors = [];

            // Process each semester group
            for (const [sem, studentIds] of Object.entries(semesterGroups)) {
                const currentSem = parseInt(sem);
                const newSem = currentSem + increment;

                // Validate semester bounds (1-10)
                if (newSem >= 1 && newSem <= 10) {
                    updates.push({
                        updateMany: {
                            filter: { _id: { $in: studentIds } },
                            update: { $set: { sem: newSem } }
                        }
                    });
                } else {
                    errors.push({
                        semester: currentSem,
                        error: `Cannot ${action} students from semester ${currentSem} (new semester ${newSem} would be out of bounds 1-10)`,
                        affectedStudents: studentIds.length
                    });
                }
            }

            if (updates.length > 0) {
                // Execute all updates in a transaction
                await Student.bulkWrite(updates, { session });
                await session.commitTransaction();

                const result = {
                    message: `Students ${action}d successfully!`,
                    updatedSemesters: updates.length,
                    totalStudentsUpdated: updates.reduce((acc, update) => acc + update.updateMany.filter._id.$in.length, 0)
                };

                if (errors.length > 0) {
                    result.warnings = errors;
                }

                res.status(200).json(result);
            } else {
                await session.abortTransaction();
                res.status(400).json({
                    message: 'No students could be updated',
                    errors: errors
                });
            }
        } catch (err) {
            await session.abortTransaction();
            const errorResponse = helper.errorLog(err, 'StudentService/promoteStudents');
            return res.status(400).send({ errorResponse });
        } finally {
            session.endSession();
        }
    }
}