const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Event = require('../models/eventModel');

// @route   GET /api/events/current
// @desc    Get the current active event with countdown info
// @access  Private
router.get('/current', authMiddleware, async (req, res) => {
    try {
        const currentEvent = await Event.findActive();

        if (!currentEvent) {
            return res.status(404).json({ error: 'No active event found' });
        }

        res.json({
            event: {
                id: currentEvent.id,
                eventDate: currentEvent.event_date,
                matchTime: currentEvent.match_time,
                status: currentEvent.status,
                matchesGenerated: currentEvent.matches_generated,
                hasMatchTimePassed: Event.hasMatchTimePassed(currentEvent)
            }
        });
    } catch (error) {
        console.error('Get current event error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/events/create
// @desc    Create a new event (admin only - add auth later)
// @access  Public (should be protected)
router.post('/create', async (req, res) => {
    try {
        const { eventDate, matchTime } = req.body;

        // Mark all active events as completed first
        await Event.markAllActiveAsCompleted();

        // Create new event
        const event = await Event.create({ eventDate, matchTime });

        res.status(201).json({
            message: 'Event created successfully',
            event
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/events/reset
// @desc    Reset event cycle (for testing)
// @access  Public (should be protected)
router.post('/reset', async (req, res) => {
    try {
        await Event.markAllActiveAsCompleted();

        const newEvent = await Event.create();

        res.json({
            message: 'Event cycle reset successfully',
            event: newEvent
        });
    } catch (error) {
        console.error('Reset event error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
