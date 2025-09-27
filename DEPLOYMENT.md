# Vercel Deployment Guide

## 🚀 Deploy Event Helper to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

### Step 2: Prepare Your Repository
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Event Helper app"
   git branch -M main
   git remote add origin https://github.com/yourusername/event-helper.git
   git push -u origin main
   ```

### Step 3: Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Click "Deploy"

### Step 4: Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyCeVs_pXSrAU1LlPpXhcnFL-6rc99u00IA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = eventhelper-45604.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = eventhelper-45604
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = eventhelper-45604.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 219984932979
NEXT_PUBLIC_FIREBASE_APP_ID = 1:219984932979:web:ff115c294db977b469fa06
```

### Step 5: Redeploy
After adding environment variables:
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment

## 🎯 Benefits of Vercel Deployment

- ✅ **HTTPS by default** (fixes mobile camera issues)
- ✅ **Global CDN** (fast loading worldwide)
- ✅ **Automatic deployments** from GitHub
- ✅ **Custom domain** support
- ✅ **Mobile-optimized** performance

## 📱 Mobile Access After Deployment

Your app will be accessible at:
- `https://your-app-name.vercel.app`
- Works on all mobile devices
- Camera access will work with HTTPS
- No more "camera access denied" errors

## 🔧 Troubleshooting

### If deployment fails:
1. Check environment variables are set correctly
2. Ensure Firebase project is active
3. Verify all dependencies are in package.json

### If mobile camera still doesn't work:
1. Clear browser cache
2. Try different mobile browser
3. Check browser permissions
