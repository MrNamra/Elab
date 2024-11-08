const { Schema, default: mongoose } = require("mongoose")

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true,
        null: false
    },
    email: {
        type: String,
        required: true,
        null: false
    },
    password: {
        type: String,
        required: true,
        null: false
    },
    role:{
        type: int,
        required: true,
        default: 1
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Admin', AdminSchema)