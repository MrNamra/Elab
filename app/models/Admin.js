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
    ucode: String,
    ucodeUpdatedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
})

// Middleware to update ucodeUpdatedAt when ucode is modified
AdminSchema.pre('save', function(next) {
    if (this.isModified('ucode')) {
        if (this.ucode) {
            this.ucodeUpdatedAt = new Date();
            
            // Set a timeout to clear the ucode after 1 hour
            setTimeout(async () => {
                try {
                    await mongoose.model('Admin').findByIdAndUpdate(
                        this._id,
                        { 
                            $set: { 
                                ucode: null,
                                ucodeUpdatedAt: null
                            }
                        }
                    );
                } catch (error) {
                    console.error('Error clearing ucode:', error);
                }
            }, 3600000); // 1 hour in milliseconds
        } else {
            this.ucodeUpdatedAt = null;
        }
    }
    next();
});

module.exports = mongoose.model('Admin', AdminSchema)