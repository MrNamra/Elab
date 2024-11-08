const { Schema, default: mongoose } = require("mongoose")

const LabSchedules = new Schema({
    sub_id: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
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
    course_id: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    dec: {
        type: String,
        required: function () {
            return !this.file_path
        },
    },
    file_path: {
        type: Text,
        required: false,
    },
    StartTime: {
        type: DateTime,
        required: true
    },
    EndTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.StartTime;
            },
            message: 'EndTime must be greater than to StartTime',
        },
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('LabSchedule', LabSchedules)