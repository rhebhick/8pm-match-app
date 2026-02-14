const { supabase } = require('../config/supabase');

class Selection {
    // Create selection
    static async create(selectionData) {
        const { data, error } = await supabase
            .from('selections')
            .insert([{
                event_id: selectionData.eventId,
                user_id: selectionData.userId,
                selected_user_id: selectionData.selectedUserId,
                is_locked: true
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Find selection by event and user
    static async findByEventAndUser(eventId, userId) {
        const { data, error } = await supabase
            .from('selections')
            .select(`
        *,
        selected_user:users!selections_selected_user_id_fkey(id, name, profile_picture)
      `)
            .eq('event_id', eventId)
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Find all selections for an event
    static async findByEvent(eventId) {
        const { data, error } = await supabase
            .from('selections')
            .select('*')
            .eq('event_id', eventId);

        if (error) throw error;
        return data;
    }

    // Count selections where user is selected (incoming requests)
    static async countBySelectedUser(eventId, selectedUserId) {
        const { count, error } = await supabase
            .from('selections')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId)
            .eq('selected_user_id', selectedUserId);

        if (error) throw error;
        return count;
    }

    // Find bidirectional selections (for matching)
    static async findBidirectional(eventId, userId1, userId2) {
        const { data, error } = await supabase
            .from('selections')
            .select('*')
            .eq('event_id', eventId)
            .or(`and(user_id.eq.${userId1},selected_user_id.eq.${userId2}),and(user_id.eq.${userId2},selected_user_id.eq.${userId1})`);

        if (error) throw error;
        return data;
    }

    // Delete selection (prevented if locked in production)
    static async delete(id) {
        const { data, error } = await supabase
            .from('selections')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Check if selection exists
    static async exists(eventId, userId) {
        const { data, error } = await supabase
            .from('selections')
            .select('id')
            .eq('event_id', eventId)
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
    }
}

module.exports = Selection;
