const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    en_no: {
        type: String,
        required: [true, 'Enrollment number is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    ip: {
        type: String,
        unique: false,
        sparse: true,
        trim: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    sem: {
        type: String,
        required: [true, 'Semester is required'],
        trim: true
    },
    div: {
        type: String,
        required: [true, 'Division is required'],
        trim: true
    }
}, {
    timestamps: true
});

// Create index for enrollment number
studentSchema.index({ en_no: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);