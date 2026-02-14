// Load environment variables FIRST before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const cron = require('node-cron');
const { initializeDatabase } = require('./config/supabase');
const { generateMatches } = require('./services/matchingService');
const Event = require('./models/eventModel');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/selections', require('./routes/selectionRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Initialize Supabase database
        await initializeDatabase();

        // Schedule matching algorithm to run at 8:00 PM IST daily
        cron.schedule('0 20 * * *', async () => {
            console.log('⏰ Running scheduled matching algorithm...');
            try {
                const currentEvent = await Event.findActive();
                if (currentEvent && !currentEvent.matches_generated) {
                    await generateMatches(currentEvent.id);
                    console.log('✅ Scheduled matching completed');
                }
            } catch (error) {
                console.error('❌ Scheduled matching failed:', error);
            }
        }, {
            timezone: 'Asia/Kolkata'
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`⏰ Matching algorithm scheduled for 8:00 PM IST daily`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
