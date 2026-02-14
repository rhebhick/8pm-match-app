# Supabase Migration Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Click "New Project"
5. Fill in:
   - Name: `8pm-platform`
   - Database Password: (generate a strong password - SAVE THIS!)
   - Region: Choose closest to you
6. Click "Create new project"
7. Wait ~2 minutes for project to be ready

## Step 2: Get Your Credentials

Once the project is ready:

1. Go to "Project Settings" (gear icon on left sidebar)
2. Click "API" tab
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - keep this SECRET!

## Step 3: Update Environment Variables

Edit `server/.env`:

```env
# Replace MongoDB URI with Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Keep these the same
JWT_SECRET=your-super-secure-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
SESSION_SECRET=your-session-secret
PORT=5000
```

## Step 4: Run Database Schema

The migration will create SQL tables automatically on first run, or you can manually create them in Supabase:

1. Go to Supabase Dashboard
2. Click "SQL Editor" (left sidebar)
3. Click "New Query"
4. Paste the schema (provided in migration)
5. Click "Run"

## Advantages of Supabase

✅ **No Local Installation** - Runs in the cloud  
✅ **Auto-scaling** - Handles growth automatically  
✅ **Built-in Auth** - Can use Supabase Auth instead of custom JWT  
✅ **Real-time** - WebSocket support out of the box  
✅ **Free Tier** - 500MB database, 2GB bandwidth  
✅ **PostgreSQL** - More powerful than MongoDB for relational data  

## Migration Status

The code is being updated to use Supabase instead of MongoDB. Once complete, you won't need to install MongoDB locally!
