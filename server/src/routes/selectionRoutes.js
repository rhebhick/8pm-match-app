const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Selection = require('../models/selectionModel');
const Event = require('../models/eventModel');

// @route   POST /api/selections
// @desc    Submit selection (locked permanently)
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { selectedUserId } = req.body;

        if (!selectedUserId) {
            return res.status(400).json({ error: 'Selected user ID is required' });
        }

        // Can't select yourself
        if (selectedUserId === req.userId) {
            return res.status(400).json({ error: 'You cannot select yourself' });
        }

        // Get current active event
        const currentEvent = await Event.findActive();

        if (!currentEvent) {
            return res.status(400).json({ error: 'No active event found' });
        }

        // Check if user already made a selection for this event
        const existingSelection = await Selection.findByEventAndUser(
            currentEvent.id,
            req.userId
        );

        if (existingSelection) {
            return res.status(400).json({
                error: 'You have already made a selection for this event',
                selection: existingSelection
            });
        }

        // Create new selection (locked by default)
        const selection = await Selection.create({
            eventId: currentEvent.id,
            userId: req.userId,
            selectedUserId
        });

        res.status(201).json({
            message: 'Selection submitted and locked successfully',
            selection: {
                id: selection.id,
                isLocked: selection.is_locked,
                timestamp: selection.created_at
            }
        });
    } catch (error) {
        console.error('Selection error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/selections/my-selection
// @desc    Get user's current selection status
// @access  Private
router.get('/my-selection', authMiddleware, async (req, res) => {
    try {
        // Get current active event
        const currentEvent = await Event.findActive();

        if (!currentEvent) {
            return res.json({ hasSelection: false });
        }

        const selection = await Selection.findByEventAndUser(
            currentEvent.id,
            req.userId
        );

        if (!selection) {
            return res.json({ hasSelection: false });
        }

        res.json({
            hasSelection: true,
            selection: {
                id: selection.id,
                selectedUser: {
                    id: selection.selected_user.id,
                    name: selection.selected_user.name,
                    profilePicture: selection.selected_user.profile_picture
                },
                isLocked: selection.is_locked,
                timestamp: selection.created_at
            }
        });
    } catch (error) {
        console.error('Get selection error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/selections/request-count
// @desc    Get count of incoming selections (how many people selected me)
// @access  Private
router.get('/request-count', authMiddleware, async (req, res) => {
    try {
        // Get current active event
        const currentEvent = await Event.findActive();

        if (!currentEvent) {
            return res.json({ count: 0 });
        }

        const count = await Selection.countBySelectedUser(
            currentEvent.id,
            req.userId
        );

        res.json({ count });
    } catch (error) {
        console.error('Get request count error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
