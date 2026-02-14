const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventDate: {
        type: Date,
        required: true,
        default: () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return today;
        }
    },
    matchTime: {
        type: Date,
        required: true,
        default: () => {
            const today = new Date();
            today.setHours(20, 0, 0, 0); // 8:00 PM
            return today;
        }
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        default: 'active'
    },
    matchesGenerated: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure only one active event at a time
eventSchema.index({ status: 1, eventDate: 1 });

// Method to check if match time has passed
eventSchema.methods.hasMatchTimePassed = function () {
    return new Date() >= this.matchTime;
};

module.exports = mongoose.model('Event', eventSchema);
