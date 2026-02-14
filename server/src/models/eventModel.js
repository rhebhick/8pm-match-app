const { supabase } = require('../config/supabase');

class Event {
    // Find event by ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Find current active event
    static async findActive() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Create new event
    static async create(eventData = {}) {
        const today = new Date();
        const matchTime = new Date();
        matchTime.setHours(20, 0, 0, 0); // 8:00 PM

        const { data, error } = await supabase
            .from('events')
            .insert([{
                event_date: eventData.eventDate || today.toISOString().split('T')[0],
                match_time: eventData.matchTime || matchTime.toISOString(),
                status: 'active',
                matches_generated: false
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Update event
    static async update(id, updates) {
        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Mark event as completed
    static async markAsCompleted(id) {
        return this.update(id, {
            status: 'completed',
            matches_generated: true
        });
    }

    // Mark all active events as completed
    static async markAllActiveAsCompleted() {
        const { data, error } = await supabase
            .from('events')
            .update({ status: 'completed' })
            .eq('status', 'active')
            .select();

        if (error) throw error;
        return data;
    }

    // Check if match time has passed
    static hasMatchTimePassed(event) {
        if (!event || !event.match_time) return false;
        return new Date() >= new Date(event.match_time);
    }

    // Find event by status
    static async findByStatus(status, limit = 1) {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('status', status)
            .order('event_date', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return limit === 1 ? data[0] : data;
    }
}

module.exports = Event;
