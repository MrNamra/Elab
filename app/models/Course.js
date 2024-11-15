const { Schema } = require("mongoose")

const CourseSchema = new Schema({
    course_name: {
        type: String,
        required: true,
        null: false,
    },
    no_of_sem: {
        type: Number,
        required: true,
        null: false,
        max: 10
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('Course', CourseSchema)