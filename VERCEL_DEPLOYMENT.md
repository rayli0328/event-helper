# 🚀 Vercel Deployment Guide for Event Helper

## Quick Deployment Steps

### 1. Create GitHub Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Name it `event-helper` or any name you prefer
3. **Don't** initialize with README (we already have files)

### 2. Push Your Code to GitHub
Run these commands in your terminal:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/event-helper.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `event-helper` repository
5. Vercel will auto-detect Next.js
6. Click "Deploy"

### 4. Configure Environment Variables
In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add these variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyCeVs_pXSrAU1LlPpXhcnFL-6rc99u00IA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = eventhelper-45604.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = eventhelper-45604
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = eventhelper-45604.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 219984932979
NEXT_PUBLIC_FIREBASE_APP_ID = 1:219984932979:web:ff115c294db977b469fa06
```

### 5. Redeploy
After adding environment variables:
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete

## 🎯 Your App Will Be Available At:
`https://your-app-name.vercel.app`

## 📱 Mobile Benefits After Deployment:
- ✅ **HTTPS by default** (fixes camera access issues)
- ✅ **Works on all mobile devices**
- ✅ **Global CDN** (fast loading worldwide)
- ✅ **No more "camera access denied" errors**
- ✅ **Professional URL** to share with staff

## 🔧 Troubleshooting

### If deployment fails:
1. Check all environment variables are set
2. Ensure Firebase project is active
3. Verify package.json has all dependencies

### If mobile camera still doesn't work:
1. Clear browser cache
2. Try different mobile browser
3. Check browser camera permissions

## 🎉 After Deployment:
1. **Test all features** on mobile
2. **Share the URL** with your team
3. **Initialize database** using the setup page
4. **Start using** for your event!

Your Event Helper app will be live and accessible from anywhere! 🌐
