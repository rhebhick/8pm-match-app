const { supabase } = require('../config/supabase');

class Match {
    // Create match
    static async create(matchData) {
        const { data, error } = await supabase
            .from('matches')
            .insert([{
                event_id: matchData.eventId,
                user1_id: matchData.user1Id,
                user2_id: matchData.user2Id,
                viewed_by_user1: false,
                viewed_by_user2: false
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Bulk create matches
    static async createMany(matchesData) {
        const { data, error } = await supabase
            .from('matches')
            .insert(matchesData)
            .select();

        if (error) throw error;
        return data;
    }

    // Find matches for a user in an event
    static async findByEventAndUser(eventId, userId) {
        const { data, error } = await supabase
            .from('matches')
            .select(`
        *,
        user1:users!matches_user1_id_fkey(id, name, email, profile_picture, bio, interests),
        user2:users!matches_user2_id_fkey(id, name, email, profile_picture, bio, interests)
      `)
            .eq('event_id', eventId)
            .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

        if (error) throw error;
        return data;
    }

    // Count matches for a user in an event
    static async countByEventAndUser(eventId, userId) {
        const { count, error } = await supabase
            .from('matches')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId)
            .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

        if (error) throw error;
        return count;
    }

    // Mark match as viewed by user
    static async markAsViewed(matchId, userId) {
        // First get the match to determine which field to update
        const { data: match, error: fetchError } = await supabase
            .from('matches')
            .select('user1_id, user2_id')
            .eq('id', matchId)
            .single();

        if (fetchError) throw fetchError;

        const updateField = match.user1_id === userId ? 'viewed_by_user1' : 'viewed_by_user2';

        const { data, error } = await supabase
            .from('matches')
            .update({ [updateField]: true })
            .eq('id', matchId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Check if user has viewed match
    static hasUserViewed(match, userId) {
        if (!match) return false;
        if (match.user1_id === userId) return match.viewed_by_user1;
        if (match.user2_id === userId) return match.viewed_by_user2;
        return false;
    }

    // Check if match exists
    static async exists(eventId, userId1, userId2) {
        const { data, error } = await supabase
            .from('matches')
            .select('id')
            .eq('event_id', eventId)
            .or(`and(user1_id.eq.${userId1},user2_id.eq.${userId2}),and(user1_id.eq.${userId2},user2_id.eq.${userId1})`)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
    }
}

module.exports = Match;
