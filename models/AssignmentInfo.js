const { Schema, default: mongoose } = require("mongoose")

const AssignmentSchema = new Schema({
    en_no: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'Students',
        required: true,
    },
    assignment_id: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'LabSchedules',
        required: true,
    },
    file_path: {
        type: Text,
        required: true,
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('AssignmentInfo', AssignmentSchema)