const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMatchCountForUser, getMatchesForUser, generateMatches } = require('../services/matchingService');
const Event = require('../models/eventModel');

// @route   GET /api/matches/count
// @desc    Get match count (only visible after 8 PM)
// @access  Private
router.get('/count', authMiddleware, async (req, res) => {
    try {
        // Get current active event
        const currentEvent = await Event.findActive();

        if (!currentEvent) {
            return res.json({ count: 0, canView: false });
        }

        // Check if match time has passed
        const canView = Event.hasMatchTimePassed(currentEvent);

        if (!canView) {
            return res.json({
                count: 0,
                canView: false,
                message: 'Match results will be available after 8:00 PM'
            });
        }

        const count = await getMatchCountForUser(req.userId, currentEvent.id);

        res.json({
            count,
            canView: true
        });
    } catch (error) {
        console.error('Get match count error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/matches
// @desc    Get match details (requires intentional request after 8 PM)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Get current active event
        const currentEvent = await Event.findActive();

        if (!currentEvent) {
            return res.status(404).json({ error: 'No active event found' });
        }

        // Verify match time has passed
        if (!Event.hasMatchTimePassed(currentEvent)) {
            return res.status(403).json({
                error: 'Match results not available yet',
                availableAt: currentEvent.match_time
            });
        }

        const matches = await getMatchesForUser(req.userId, currentEvent.id);

        res.json({ matches });
    } catch (error) {
        console.error('Get matches error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/matches/generate
// @desc    Generate matches (manual trigger for testing / admin / cron)
// @access  Public (should be protected in production)
router.post('/generate', async (req, res) => {
    try {
        // Get current active event
        const currentEvent = await Event.findActive();

        if (!currentEvent) {
            return res.status(404).json({ error: 'No active event found' });
        }

        // Check if matches already generated
        if (currentEvent.matches_generated) {
            return res.status(400).json({
                error: 'Matches already generated for this event'
            });
        }

        const result = await generateMatches(currentEvent.id);

        res.json({
            message: 'Matches generated successfully',
            ...result
        });
    } catch (error) {
        console.error('Generate matches error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
