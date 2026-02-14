const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    profile: {
        bio: {
            type: String,
            maxlength: 500,
            default: ''
        },
        interests: {
            type: [String],
            default: []
        },
        age: {
            type: Number,
            min: 13,
            max: 120
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer-not-to-say'],
            default: 'prefer-not-to-say'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

// Update lastActive on save
userSchema.pre('save', function (next) {
    this.lastActive = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
