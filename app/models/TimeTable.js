const { Schema, mongo, default: mongoose } = require("mongoose")

const TimeTableSchema = new Schema({
    day: {
        type: String,
        required: true,
        null: false,
    },
    div: {
        type: String,
        required: true,
        null: false,
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    sem: {
        type: Number,
        required: true,
        null: false,
        max: 10
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    StartTime: {
        type: Date,
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