const { Schema, default: mongoose } = require("mongoose");

const AdminSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            null: false,
        },
        email: {
            type: String,
            required: true,
            null: false,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            null: false,
        },
        role: {
            type: Number,
            required: true,
            default: 1,
        },
        ucode: {
            type: String,
            default: null,
        },
        ucodeUpdatedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Middleware to update ucodeUpdatedAt when ucode is modified
AdminSchema.pre("save", function (next) {
    if (this.isModified("ucode")) {
        this.ucodeUpdatedAt = this.ucode ? new Date() : null;
    }
    next();
});

module.exports = mongoose.model("Admin", AdminSchema);