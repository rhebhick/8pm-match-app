# 🚀 Deployment Guide - GitHub & Vercel

This guide will walk you through deploying the 8PM app to production.

---

## 📋 Prerequisites Checklist

Before deploying, make sure you have:

- ✅ **Supabase project** created with schema loaded
- ✅ **Google OAuth credentials** configured
- ✅ **GitHub account** (create at github.com if needed)
- ✅ **Vercel account** (create at vercel.com if needed)
- ✅ **Git installed** on your computer

---

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository

Open terminal in your project root and run:

```bash
git init
git add .
git commit -m "Initial commit - 8PM Valentine's Day App"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `8pm-match-app` (or your choice)
3. **Keep it Private** (recommended for now)
4. **Don't** initialize with README, .gitignore, or license
5. Click "Create repository"

### Step 3: Push to GitHub

Copy the commands from GitHub (will look like this):

```bash
git remote add origin https://github.com/YOUR-USERNAME/8pm-match-app.git
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## Part 2: Deploy Backend to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Select your `8pm-match-app` repository
5. **Configure Project:**

   **Framework Preset:** Other
   
   **Root Directory:** `server`
   
   **Build Command:** Leave empty or use `npm install`
   
   **Output Directory:** Leave empty
   
   **Install Command:** `npm install`

6. **Add Environment Variables** (CRITICAL!):

   Click "Environment Variables" and add these:

   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   JWT_SECRET=your-jwt-secret-min-32-chars
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CLIENT_URL=https://your-frontend-url.vercel.app
   SERVER_URL=https://your-backend-url.vercel.app
   SESSION_SECRET=your-session-secret
   PORT=5000
   ```

   > **Note:** You'll need to update `CLIENT_URL` after deploying frontend

7. Click **"Deploy"**

8. **Copy the backend URL** (e.g., `https://8pm-backend.vercel.app`)

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Update API Base URL

Before deploying frontend, update the API URL:

Edit `client/src/services/apiService.js`:

```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'https://YOUR-BACKEND-URL.vercel.app';
```

Commit this change:

```bash
git add .
git commit -m "Update API URL for production"
git push
```

### Step 2: Deploy Frontend

1. In Vercel Dashboard, click **"Add New Project"** again
2. Select the **same repository** (`8pm-match-app`)
3. **Configure Project:**

   **Framework Preset:** Vite
   
   **Root Directory:** `client`
   
   **Build Command:** `npm run build`
   
   **Output Directory:** `dist`
   
   **Install Command:** `npm install`

4. **Add Environment Variables:**

   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

5. Click **"Deploy"**

6. **Copy the frontend URL** (e.g., `https://8pm-app.vercel.app`)

---

## Part 4: Update Environment Variables

### Step 1: Update Backend Environment

Go back to your **backend deployment** in Vercel:

1. Click on your backend project
2. Go to **Settings** → **Environment Variables**
3. Update `CLIENT_URL` to your frontend URL:
   ```
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
4. **Redeploy** the backend:
   - Go to **Deployments** tab
   - Find latest deployment
   - Click "..." → "Redeploy"

### Step 2: Update Google OAuth Redirect URIs

1. Go to https://console.cloud.google.com/
2. Navigate to **APIs & Services** → **Credentials**
3. Click your OAuth 2.0 Client ID
4. **Add to Authorized JavaScript origins:**
   ```
   https://your-backend-url.vercel.app
   https://your-frontend-url.vercel.app
   ```
5. **Add to Authorized redirect URIs:**
   ```
   https://your-backend-url.vercel.app/auth/google/callback
   ```
6. Click **"Save"**

---

## Part 5: Verify Deployment

### Test Your Production App:

1. **Visit your frontend URL:** `https://your-frontend-url.vercel.app`
2. **Click "Sign in with Google"**
3. **Grant permissions**
4. **You should be redirected to dashboard!**

If everything works: **🎉 You're LIVE!**

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to server"

**Solution:**
- Check backend logs in Vercel
- Verify `VITE_API_URL` in frontend env vars
- Make sure backend is deployed and running

### Issue: "OAuth redirect URI mismatch"

**Solution:**
- Double-check Google Cloud Console redirect URIs
- Make sure you added the Vercel URLs
- No trailing slashes in URIs

### Issue: "Database connection failed"

**Solution:**
- Verify Supabase environment variables in backend
- Check `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Make sure Supabase project is active

### Issue: "CORS errors"

**Solution:**
- Update `CLIENT_URL` in backend environment
- Redeploy backend after changing env vars
- Clear browser cache

---

## 📝 Important Files for Deployment

### `.gitignore` (Already created)

Make sure these are ignored:
```
node_modules/
.env
.env.local
dist/
build/
```

### `vercel.json` for Backend

Create `server/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

### `vercel.json` for Frontend

Create `client/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Google login works
- [ ] Can view dashboard
- [ ] Can browse participants
- [ ] Can make selections
- [ ] Countdown timer works
- [ ] Matches appear after 8 PM
- [ ] Mobile responsive design works

---

## 💡 Tips for Production

### 1. **Custom Domain** (Optional)

In Vercel:
- Go to project **Settings** → **Domains**
- Add your custom domain
- Update Google OAuth URIs with custom domain

### 2. **Environment Security**

- Never commit `.env` files
- Use Vercel's environment variables
- Rotate secrets periodically
- Use different credentials for production vs development

### 3. **Monitoring**

- Check Vercel **Analytics** for traffic
- Monitor **Functions** logs for errors
- Set up **Supabase** monitoring for database

### 4. **Scaling**

Vercel auto-scales, but watch:
- Supabase free tier limits (500MB database)
- Vercel function execution time
- API rate limits

---

## 🚨 Common Gotchas

1. **Cron Jobs Don't Work on Vercel Hobby**
   - Vercel serverless functions don't support cron on free tier
   - Consider using Supabase Edge Functions or Railway for backend

2. **Environment Variables**
   - Must be set in **both** frontend and backend projects
   - `VITE_` prefix required for frontend env vars
   - Redeploy after changing env vars

3. **CORS Issues**
   - Make sure `CLIENT_URL` exactly matches frontend URL
   - No trailing slashes
   - HTTPS in production (Vercel handles this)

---

## 🔄 Alternative: Deploy Backend to Railway

If you need cron jobs for the matching algorithm:

1. Go to https://railway.app
2. Create new project from GitHub repo
3. Select `server` directory
4. Add same environment variables
5. Deploy
6. Update frontend `VITE_API_URL` to Railway URL

Railway has better support for background jobs and cron.

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Railway Docs:** https://docs.railway.app

---

**Good luck with your deployment! 🚀💕**
