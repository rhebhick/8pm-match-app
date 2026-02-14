# 🚀 Quick Start Guide - 8PM Platform

Follow these steps to get the 8PM platform running locally.

---

## Step 1: Set Up Supabase (Cloud Database)

### Create Your Free Supabase Project

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Click "Start your project"

2. **Sign Up / Sign In**
   - Use GitHub (recommended) or email

3. **Create New Project**
   - Click "New Project"
   - Fill in:
     - **Name:** `8pm-platform`
     - **Database Password:** Generate a strong password (SAVE THIS!)
     - **Region:** Choose closest to your location
   - Click "Create new project"
   - Wait ~2 minutes for setup

4. **Run Database Schema**
   - Once ready, click "SQL Editor" in the left sidebar
   - Click "New Query"
   - Open the file `server/schema.sql` from your project
   - Copy all the SQL code and paste it into the Supabase SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

5. **Get Your Credentials**
   - Go to "Project Settings" (gear icon on left)
   - Click "API" tab
   - Copy these TWO values:
```markdown
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
```
     - **service_role** key (starts with `eyJ...`) - This is SECRET!

---

## Step 2: Set Up Google OAuth

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a Project**
   - Click "New Project"
   - Name it "8PM Platform"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure consent screen first:
     - Choose "External"
     - Fill in app name: "8PM Platform"
     - Add your email
     - Save
   - Back to Create Credentials → "OAuth client ID"
   - Application type: "Web application"
   - Name: "8PM OAuth"
   
5. **Configure Redirect URIs**
   - Under "Authorized JavaScript origins" add:
     - `http://localhost:5000`
     - `http://localhost:5173`
   - Under "Authorized redirect URIs" add:
     - `http://localhost:5000/auth/google/callback`
   - Click "Create"

6. **Copy Credentials**
   - You'll see a Client ID and Client Secret
   - **SAVE THESE** - you'll need them in the next step!

---

## Step 3: Configure Environment Variables

1. **Navigate to server folder:**

```bash
cd server
```

2. **Edit the `.env` file:**

Open `server/.env` in your text editor and replace with:

```env
# Supabase Configuration (from Step 1)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-role-key-here

# JWT Secret (generate a random string, min 32 characters)
JWT_SECRET=my-super-secret-jwt-key-change-this-to-something-random-12345

# Google OAuth (from Step 2)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# URLs (keep these as-is for local development)
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# Session Secret (generate another random string)
SESSION_SECRET=my-session-secret-change-this-also-67890

# Port
PORT=5000
```

**⚠️ Important:**
- Replace `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` with YOUR actual Supabase values
- Replace `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with YOUR actual Google credentials
- Change `JWT_SECRET` to a random string (at least 32 characters)
- Change `SESSION_SECRET` to another random string

---

## Step 4: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

This will install all required packages including the Supabase client.

---

## Step 5: Start the Application

### Terminal 1 - Start Backend:

```bash
cd server
npm run dev
```

✅ **You should see:**
```
✅ Supabase database initialized
✅ Created initial event for 2026-02-14
🚀 Server running on port 5000
⏰ Matching algorithm scheduled for 8:00 PM IST daily
```

### Terminal 2 - Start Frontend:

```bash
cd client
npm run dev
```

✅ **You should see:**
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Step 6: Access the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. Click **"Sign in with Google"**
4. Grant permissions
5. You'll be redirected to the Dashboard!

---

## 🧪 Testing the Application

### Test Scenario 1: Make a Selection

1. Sign in with Google account #1
2. Click "Browse Participants"
3. Select another user
4. Confirm the selection (it will be locked ✅)
5. Return to dashboard - you should see "Selection: Locked"

### Test Scenario 2: Create a Mutual Match

1. Open an **incognito/private** browser window
2. Sign in with Google account #2 (different email)
3. Browse participants and select Account #1
4. Confirm selection
5. **Wait until 8 PM** (or manually trigger - see below)
6. Check dashboard - both users should see match count!

### 🔧 Manually Trigger Matching (For Testing)

Use the browser console on http://localhost:5173:

```javascript
fetch('http://localhost:5000/api/matches/generate', { method: 'POST' })
  .then(r => r.json())
  .then(console.log);
```

Or use curl:

```bash
curl -X POST http://localhost:5000/api/matches/generate
```

---

## 🔧 Troubleshooting

### "Failed to load user" / "Server error"
- ✅ Check if backend is running on port 5000
- ✅ Verify Supabase credentials in `.env` are correct
- ✅ Check terminal for error messages
- ✅ Verify SQL schema was run successfully in Supabase

### "OAuth redirect URI mismatch"
- ✅ Go back to Google Cloud Console
- ✅ Verify redirect URI is exactly: `http://localhost:5000/auth/google/callback`
- ✅ Make sure there are no trailing slashes
- ✅ Check both JavaScript origins AND redirect URIs are configured

### "Cannot connect to server"
- ✅ Ensure backend is running on port 5000
- ✅ Check for port conflicts (close other apps using port 5000)
- ✅ Try restarting the server

### "No participants showing"
- ✅ You need at least 2 users signed in
- ✅ Try signing in with different Google accounts
- ✅ Check Supabase dashboard → Table Editor → users table

### "Supabase initialization failed"
- ✅ Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct
- ✅ Make sure you copied the **service_role** key, not the **anon** key
- ✅ Check your Supabase project is active

---

## ⏰ Default Event Time

The matching algorithm runs automatically at **8:00 PM IST** every day.

To test with a different time, modify `server/src/server.js` cron schedule:

```javascript
// Current: runs at 8:00 PM
cron.schedule('0 20 * * *', async () => {

// Change to 3:30 PM:
cron.schedule('30 15 * * *', async () => {
```

---

## 🎉 Success Checklist

- ✅ Supabase project created and schema loaded
- ✅ Google OAuth credentials configured
- ✅ Environment variables set in `.env`
- ✅ Dependencies installed (`npm install` in both folders)
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ Can sign in with Google
- ✅ Can see dashboard with countdown timer
- ✅ Can browse participants and make selections

---

## 📚 Additional Resources

- **Full Documentation:** See `README.md`
- **Supabase Setup Guide:** See `SUPABASE_MIGRATION.md`
- **Project Walkthrough:** See artifact `walkthrough.md`

---

## 🚀 Advantages of Supabase

✅ **No Local Installation** - Runs in the cloud  
✅ **Free Tier** - 500MB database, perfect for testing  
✅ **Auto-scaling** - Handles growth automatically  
✅ **Real-time** - WebSocket support built-in  
✅ **Visual Dashboard** - Easy to view and manage data  
✅ **PostgreSQL** - More powerful than MongoDB for relational data  

---

Need help? Check the troubleshooting section above or create an issue!

**Happy Matching! 💙**
