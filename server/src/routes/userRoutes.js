const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// @route   GET /api/users/profile
// @desc    Get own profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/users/profile
// @desc    Update own profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { bio, interests, age, gender } = req.body;

        const updates = {};
        if (bio !== undefined) updates.bio = bio;
        if (interests !== undefined) updates.interests = interests;
        if (age !== undefined) updates.age = age;
        if (gender !== undefined) updates.gender = gender;

        const user = await User.update(req.userId, updates);

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/users/participants
// @desc    Get list of participants (for search/browse)
// @access  Private
router.get('/participants', authMiddleware, async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;

        const offset = (page - 1) * limit;
        const { users, total } = await User.findAllActive(
            req.userId,
            search || '',
            parseInt(limit),
            offset
        );

        res.json({
            participants: users,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error('Get participants error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/users/:id
// @desc    Get specific user profile (limited info for privacy)
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return limited info
        res.json({
            user: {
                id: user.id,
                name: user.name,
                profile_picture: user.profile_picture,
                bio: user.bio,
                interests: user.interests,
                age: user.age,
                gender: user.gender
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
