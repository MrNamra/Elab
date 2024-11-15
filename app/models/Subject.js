const { Schema, default: mongoose } = require("mongoose")

const SubjectSchema = new Schema({
    subject_code: {
        type: String,
        required: true,
        null: false,
        unique: true,
    },
    subject_name: {
        type: String,
        required: true,
        null: false,
    },
    sem: {
        type: Number,
        required: true,
        null: false,
        max: 10
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Subject', SubjectSchema)