# 8PM - Privacy-First Mutual Match Platform

A privacy-first, event-based mutual match platform where participants can express interest safely within a limited event window.

## Features

- 🔒 **Privacy First**: No public announcements or visible rejections
- 💝 **Mutual Consent**: Matches only occur when both parties select each other
- 🛡️ **Emotional Safety**: Complete privacy for one-sided selections
- ⏰ **Time-Based Disclosure**: Controlled reveal at 8:00 PM
- 🔐 **Google OAuth**: Secure authentication

## Tech Stack

### Backend
- Node.js + Express
- **Supabase (PostgreSQL)** - Cloud database
- Google OAuth 2.0 (Passport.js)
- JWT Authentication
- Node-Cron for automated matching

### Frontend
- React 18
- React Router
- Axios
- Vite (Build Tool)
- Modern CSS with Glassmorphism

## Getting Started

### Prerequisites
- Node.js 16+ installed
- **Supabase account** (free tier works great!)
- Google Cloud OAuth credentials

### Setup

1. **Install Dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

2. **Set Up Supabase**

Follow the detailed guide in [SUPABASE_MIGRATION.md](SUPABASE_MIGRATION.md):
- Create a free Supabase project
- Copy your Project URL and Service Key
- Run the SQL schema (in `server/schema.sql`)

```env
MONGODB_URI=mongodb://localhost:27017/8pm
JWT_SECRET=your-super-secure-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
SESSION_SECRET=your-session-secret
PORT=5000
```

3. **Get Google OAuth Credentials**

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
- Copy Client ID and Client Secret to `.env`

### Running the Application

1. **Start MongoDB**

```bash
mongod
```

2. **Start Backend Server**

1. **Start Backend Server**

```bash
cd server
npm run dev
```

You should see:
```
✅ Supabase database initialized
✅ Created initial event for [today's date]
🚀 Server running on port 5000
⏰ Matching algorithm scheduled for 8:00 PM IST daily
```

2. **Start Frontend**


```bash
cd client
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

3. **Access the Application**

Open your browser and navigate to `http://localhost:5173`

## How It Works

1. **Sign In**: Users authenticate with Google
2. **Browse Participants**: View registered users
3. **Make Selection**: Choose ONE person (locked permanently)
4. **Wait for 8 PM**: Dashboard shows countdown and request count
5. **Match Reveal**: After 8 PM, see mutual matches only
6. **Connect**: Contact matched users

## Core Rules

- ✅ Single selection per event (locked after submission)
- ✅ Matches shown only if both parties select each other
- ✅ No exposure of one-sided selections
- ✅ Match details revealed only after 8 PM
- ✅ Intentional action required to view matches

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate OAuth flow
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/current-user` - Get current user
- `POST /auth/logout` - Logout

### Users
- `GET /api/users/profile` - Get own profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/participants` - Browse participants
- `GET /api/users/:id` - Get user by ID

### Selections
- `POST /api/selections` - Submit selection
- `GET /api/selections/my-selection` - Get own selection
- `GET /api/selections/request-count` - Get incoming request count

### Matches
- `GET /api/matches/count` - Get match count (post-8PM)
- `GET /api/matches` - Get match details (post-8PM)
- `POST /api/matches/generate` - Generate matches (admin/cron)

### Events
- `GET /api/events/current` - Get current event
- `POST /api/events/create` - Create event (admin)
- `POST /api/events/reset` - Reset event cycle (admin)

## Automated Matching

The server runs a cron job daily at 8:00 PM (IST) to automatically generate matches. Configure timezone in `server/src/server.js`.

## License

MIT

---

*Built with privacy, designed for dignity, created for connection.* 💙
