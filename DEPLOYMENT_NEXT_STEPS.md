# 🎯 Next Steps for Deployment

## ✅ Backend Deployed!
**URL:** https://8pm-match-app.vercel.app/

---

## 📋 Now Deploy Frontend

### Step 1: Commit the changes

```bash
git add .
git commit -m "Add production environment config"
git push
```

### Step 2: Deploy Frontend on Vercel

1. Go to **vercel.com**
2. Click **"Add New Project"**
3. Select **"8pm-match-app"** repository
4. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variable:**
   ```
   VITE_API_URL=https://8pm-match-app.vercel.app
   ```

6. Click **"Deploy"**

### Step 3: After Frontend Deploys

Once you get your frontend URL (e.g., `https://8pm-match-app-frontend.vercel.app`):

1. **Update Backend Environment:**
   - Go to backend project in Vercel
   - Settings → Environment Variables
   - Update `CLIENT_URL` to your frontend URL
   - Redeploy backend

2. **Update Google OAuth:**
   - Go to Google Cloud Console
   - APIs & Services → Credentials
   - Add to **Authorized JavaScript origins:**
     - `https://8pm-match-app.vercel.app`
     - `https://YOUR-FRONTEND-URL.vercel.app`
   - Add to **Authorized redirect URIs:**
     - `https://8pm-match-app.vercel.app/auth/google/callback`

---

## 🔧 Important Notes

### ⚠️ Cron Job Issue
The matching algorithm uses `node-cron` which **doesn't work on Vercel's free tier**.

**Solutions:**
1. **Manual Trigger:** Call `/api/matches/generate` endpoint manually at 8 PM
2. **Use Railway:** Deploy backend to Railway.app instead (supports cron)
3. **Use Vercel Cron (Pro):** Upgrade to Vercel Pro for cron support

### 📱 Test Your App

After both deployments:
1. Visit your frontend URL
2. Click "Sign in with Google"
3. Check if authentication works
4. Test the full flow

---

## 🚨 Troubleshooting

**"Cannot connect to server"**
- Check VITE_API_URL in frontend
- Verify backend is running
- Check browser console for CORS errors

**"OAuth redirect mismatch"**
- Update Google Cloud Console URIs
- Make sure they match exactly (no trailing slashes)

**"Database errors"**
- Verify Supabase credentials in backend
- Check Supabase project is active

---

Ready? Commit and deploy! 🚀
