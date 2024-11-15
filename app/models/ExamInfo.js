const { Schema, default: mongoose } = require("mongoose")

const ExamInfoSchema = new Schema({
    en_no: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'Students',
        required: true,
    },
    exam_id: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'ExamSchedules',
        required: true,
    },
    file_path: {
        type: Text,
        required: true,
    },
    marks: {
        type: Number,
        default: 0
    },
    ip: {
        type: String,
        required: true,
    },
})

exports.modules = mongoose.model('ExamInfo', ExamInfoSchema)