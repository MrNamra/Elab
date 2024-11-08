const {  Schema, default: mongoose } = require("mongoose")

const ExamSchedules = new Schema({
    sub_id: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    course_id: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    div: {
        type: String,
        required: true,
    },
    sem: {
        type: Number,
        required: true,
        max: 10
    },
    title: {
        type: String,
        required: true,
    },
    dec: {
        type: String,
        required: true,
    },
    file_path: {
        type: Text,
        required: false,
    },
    exam_type: {
        type: String,
        required: true,
        enum: ['Internal', 'External']
    },
    StartTime: {
        type: DateTime,
        required: true
    },
    EndTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v > this.StartTime
            },
            message: 'EndTime must be greater than to StartTime',
        },
    },
},
{
    timestamps: true
}
)

module.exports = mongoose.model('ExamSchedule', ExamSchedules)