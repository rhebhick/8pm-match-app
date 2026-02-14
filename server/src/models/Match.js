const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true
    },
    user1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    user2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    viewedByUser1: {
        type: Boolean,
        default: false
    },
    viewedByUser2: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent duplicate matches
matchSchema.index({ eventId: 1, user1Id: 1, user2Id: 1 }, { unique: true });

// Method to check if user has viewed this match
matchSchema.methods.hasUserViewed = function (userId) {
    if (this.user1Id.toString() === userId.toString()) {
        return this.viewedByUser1;
    }
    if (this.user2Id.toString() === userId.toString()) {
        return this.viewedByUser2;
    }
    return false;
};

// Method to mark match as viewed by user
matchSchema.methods.markAsViewed = function (userId) {
    if (this.user1Id.toString() === userId.toString()) {
        this.viewedByUser1 = true;
    }
    if (this.user2Id.toString() === userId.toString()) {
        this.viewedByUser2 = true;
    }
    return this.save();
};

module.exports = mongoose.model('Match', matchSchema);
