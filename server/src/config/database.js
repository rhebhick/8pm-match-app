const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Create initial event if none exists
        const Event = require('../models/Event');
        const existingEvent = await Event.findOne({ status: 'active' });

        if (!existingEvent) {
            const newEvent = await Event.create({
                eventDate: new Date(),
                status: 'active'
            });
            console.log(`✅ Created initial event for ${newEvent.eventDate.toDateString()}`);
        }
    } catch (error) {
        console.error(`❌ Database connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
