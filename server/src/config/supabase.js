const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.error('Please add SUPABASE_URL and SUPABASE_SERVICE_KEY');
    process.exit(1);
}

// Create Supabase client with service role key (for server-side operations)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Initialize database tables
const initializeDatabase = async () => {
    try {
        console.log('🔄 Checking database schema...');

        // Check if tables exist by trying to query them
        const { error: usersError } = await supabase
            .from('users')
            .select('id')
            .limit(1);

        if (usersError && usersError.code === 'PGRST116') {
            console.log('📝 Creating database tables...');
            await createTables();
        } else {
            console.log('✅ Database tables already exist');
        }

        // Create initial event if none exists
        const { data: existingEvent } = await supabase
            .from('events')
            .select('id')
            .eq('status', 'active')
            .single();

        if (!existingEvent) {
            const today = new Date();
            today.setHours(20, 0, 0, 0); // 8:00 PM

            const { error } = await supabase
                .from('events')
                .insert([{
                    event_date: new Date().toISOString().split('T')[0],
                    match_time: today.toISOString(),
                    status: 'active',
                    matches_generated: false
                }]);

            if (!error) {
                console.log(`✅ Created initial event for today`);
            }
        }

        console.log('✅ Supabase database initialized');
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
    }
};

// SQL to create tables (can also be run manually in Supabase SQL editor)
const createTables = async () => {
    const schema = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      google_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      profile_picture TEXT,
      bio TEXT,
      interests TEXT[],
      age INTEGER,
      gender VARCHAR(50),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Events table
    CREATE TABLE IF NOT EXISTS events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_date DATE NOT NULL DEFAULT CURRENT_DATE,
      match_time TIMESTAMP WITH TIME ZONE NOT NULL,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed')),
      matches_generated BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Selections table
    CREATE TABLE IF NOT EXISTS selections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID REFERENCES events(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      selected_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      is_locked BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(event_id, user_id)
    );

    -- Matches table
    CREATE TABLE IF NOT EXISTS matches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID REFERENCES events(id) ON DELETE CASCADE,
      user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
      user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
      viewed_by_user1 BOOLEAN DEFAULT false,
      viewed_by_user2 BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(event_id, user1_id, user2_id)
    );

    -- Indexes for faster queries
    CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_selections_event ON selections(event_id);
    CREATE INDEX IF NOT EXISTS idx_selections_user ON selections(user_id);
    CREATE INDEX IF NOT EXISTS idx_selections_selected_user ON selections(selected_user_id);
    CREATE INDEX IF NOT EXISTS idx_matches_event ON matches(event_id);
    CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
    CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);
  `;

    console.log('ℹ️  Please run the schema in Supabase SQL Editor');
    console.log('Schema saved to: server/src/schema.sql');

    // Save schema to file for manual execution
    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(
        path.join(__dirname, '../schema.sql'),
        schema,
        'utf8'
    );
};

module.exports = {
    supabase,
    initializeDatabase
};
