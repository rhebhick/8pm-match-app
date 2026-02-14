const Selection = require('../models/selectionModel');
const Match = require('../models/matchModel');
const Event = require('../models/eventModel');

/**
 * Core matching algorithm - runs at 8:00 PM
 * Finds bidirectional selections and creates mutual matches
 */
const generateMatches = async (eventId) => {
    try {
        // Get all selections for this event
        const selections = await Selection.findByEvent(eventId);

        console.log(`🔍 Processing ${selections.length} selections for event ${eventId}`);

        const matches = [];
        const processed = new Set();

        // Find mutual selections
        for (const selection of selections) {
            const userId = selection.user_id;
            const selectedUserId = selection.selected_user_id;
            const pairKey = [userId, selectedUserId].sort().join('-');

            // Skip if already processed
            if (processed.has(pairKey)) continue;

            // Check if the selected user also selected this user
            const reverseSelection = selections.find(
                s => s.user_id === selectedUserId && s.selected_user_id === userId
            );

            if (reverseSelection) {
                // Mutual match found!
                matches.push({
                    event_id: eventId,
                    user1_id: userId,
                    user2_id: selectedUserId,
                    viewed_by_user1: false,
                    viewed_by_user2: false
                });

                processed.add(pairKey);
                console.log(`💘 Match found: ${userId} ↔️ ${selectedUserId}`);
            }
        }

        // Save all matches
        if (matches.length > 0) {
            await Match.createMany(matches);
            console.log(`✅ Created ${matches.length} mutual matches`);
        } else {
            console.log(`ℹ️  No mutual matches found for this event`);
        }

        // Mark event as processed
        await Event.markAsCompleted(eventId);

        return {
            success: true,
            matchCount: matches.length,
            totalSelections: selections.length
        };
    } catch (error) {
        console.error('❌ Error generating matches:', error);
        throw error;
    }
};

/**
 * Get match count for a user (after 8 PM only)
 */
const getMatchCountForUser = async (userId, eventId) => {
    const count = await Match.countByEventAndUser(eventId, userId);
    return count;
};

/**
 * Get match details for a user (requires intentional request)
 */
const getMatchesForUser = async (userId, eventId) => {
    const matches = await Match.findByEventAndUser(eventId, userId);

    // Return the matched users (not the current user)
    return matches.map(match => {
        const isUser1 = match.user1_id === userId;
        const matchedUser = isUser1 ? match.user2 : match.user1;

        return {
            matchId: match.id,
            matchedUser: {
                id: matchedUser.id,
                name: matchedUser.name,
                email: matchedUser.email,
                profilePicture: matchedUser.profile_picture,
                profile: {
                    bio: matchedUser.bio,
                    interests: matchedUser.interests
                }
            },
            viewed: Match.hasUserViewed(match, userId),
            matchedAt: match.created_at
        };
    });
};

module.exports = {
    generateMatches,
    getMatchCountForUser,
    getMatchesForUser
};
