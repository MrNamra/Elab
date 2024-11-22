const { Schema, default: mongoose } = require("mongoose")

const SubjectDataSchema = new Schema({
    sub_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('SubjectData', SubjectDataSchema)