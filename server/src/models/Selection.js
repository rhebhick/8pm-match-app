const mongoose = require('mongoose');

const selectionSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    selectedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    isLocked: {
        type: Boolean,
        default: true // Always locked once submitted
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one selection per user per event
selectionSchema.index({ eventId: 1, userId: 1 }, { unique: true });

// Index for finding who selected a specific user
selectionSchema.index({ eventId: 1, selectedUserId: 1 });

// Prevent deletion of locked selections
selectionSchema.pre('remove', function (next) {
    if (this.isLocked) {
        next(new Error('Cannot delete a locked selection'));
    } else {
        next();
    }
});

module.exports = mongoose.model('Selection', selectionSchema);
