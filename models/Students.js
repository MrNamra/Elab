const { Schema, mongo, default: mongoose } = require("mongoose")

const StudnetsSchema = new Schema({
    en_no: {
        type: String,
        required: true,
        null: false,
        unique: true,        
    },
    name: {
        type: String,
        required: true,
        null: false,
    },

    ip: String,

    course_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    sem:{
        type: Number,
        required: true,
        null: false,
        max: 10
    },
    div: {
        type: String,
        required: true,
        null: false
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Student', StudnetsSchema)