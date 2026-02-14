const { supabase } = require('../config/supabase');

class User {
    // Find user by Google ID
    static async findByGoogleId(googleId) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', googleId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Find user by ID
    static async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Find user by email
    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    // Create new user
    static async create(userData) {
        const { data, error } = await supabase
            .from('users')
            .insert([{
                google_id: userData.googleId,
                email: userData.email,
                name: userData.name,
                profile_picture: userData.profilePicture || '',
                bio: userData.bio || '',
                interests: userData.interests || [],
                age: userData.age || null,
                gender: userData.gender || 'prefer-not-to-say'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Update user
    static async update(id, updates) {
        const { data, error } = await supabase
            .from('users')
            .update({
                ...updates,
                last_active: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Update last active timestamp
    static async updateLastActive(id) {
        const { data, error } = await supabase
            .from('users')
            .update({ last_active: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Get all active users (for participant list)
    static async findAllActive(excludeUserId, searchQuery = '', limit = 20, offset = 0) {
        let query = supabase
            .from('users')
            .select('id, name, profile_picture, bio, interests, age, gender', { count: 'exact' })
            .eq('is_active', true)
            .neq('id', excludeUserId);

        // Add search filter
        if (searchQuery) {
            query = query.or(`name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
        }

        query = query
            .order('last_active', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;
        return { users: data, total: count };
    }

    // Count total users
    static async count(filters = {}) {
        let query = supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (filters.is_active !== undefined) {
            query = query.eq('is_active', filters.is_active);
        }

        const { count, error } = await query;

        if (error) throw error;
        return count;
    }
}

module.exports = User;
