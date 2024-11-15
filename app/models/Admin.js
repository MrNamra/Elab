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
        null: false,
        unique: true
    },
    password: {
        type: String,
        required: true,
        null: false
    },
    role:{
        type: Number,
        required: true,
        default: 1
    },
    ucode: String
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Admin', AdminSchema)