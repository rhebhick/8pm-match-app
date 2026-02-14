const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @route   GET /auth/google
// @desc    Initiate Google OAuth flow
// @access  Public
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }),
    (req, res) => {
        try {
            // Generate JWT token (use .id not ._id for Supabase)
            const token = jwt.sign(
                { userId: req.user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Redirect to frontend with token
            res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
        }
    }
);

// @route   GET /auth/current-user
// @desc    Get current authenticated user
// @access  Private
router.get('/current-user', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user without google_id for security
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profile_picture: user.profile_picture,
                bio: user.bio,
                interests: user.interests,
                age: user.age,
                gender: user.gender
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// @route   POST /auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
