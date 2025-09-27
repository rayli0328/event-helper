# 🚀 Deploy Event Helper to Vercel via GitHub

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Recommended)
1. **Go to** [github.com](https://github.com)
2. **Sign up/Login** with your email
3. **Click "New Repository"** (green button)
4. **Repository name**: `event-helper`
5. **Description**: `Event Management App with QR Code Scanner`
6. **Make it Public** (required for free Vercel)
7. **Don't initialize** with README (we already have files)
8. **Click "Create Repository"**

### Option B: Using GitHub CLI (Alternative)
```bash
# Install GitHub CLI first
# Then run:
gh repo create event-helper --public --source=. --remote=origin --push
```

## Step 2: Push Your Code to GitHub

### If you used Option A (Website):
```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/event-helper.git

# Push your code
git branch -M main
git push -u origin main
```

### If you used Option B (CLI):
The code is already pushed automatically!

## Step 3: Deploy to Vercel

1. **Go to** [vercel.com](https://vercel.com)
2. **Click "New Project"**
3. **Click "Continue with GitHub"**
4. **Authorize Vercel** to access your GitHub
5. **Find your repository**: `event-helper`
6. **Click "Import"**

## Step 4: Configure Environment Variables

In Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCeVs_pXSrAU1LlPpXhcnFL-6rc99u00IA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eventhelper-45604.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=eventhelper-45604
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eventhelper-45604.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=219984932979
NEXT_PUBLIC_FIREBASE_APP_ID=1:219984932979:web:ff115c294db977b469fa06
```

## Step 5: Deploy!

1. **Click "Deploy"**
2. **Wait for deployment** (2-3 minutes)
3. **Get your live URL**: `https://event-helper-xxx.vercel.app`

## 🎉 Success!

Your Event Helper app will be live at:
- ✅ **HTTPS by default** (fixes mobile camera issues)
- ✅ **Works on all devices**
- ✅ **Professional URL**
- ✅ **Automatic deployments** when you push to GitHub

## 🔄 Future Updates

To update your app:
1. **Make changes** to your code
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Update app"
   git push
   ```
3. **Vercel automatically redeploys** your app!

## 📱 Test Your App

After deployment:
1. **Visit your Vercel URL**
2. **Test QR code generation**
3. **Test QR code scanning on mobile**
4. **Verify Firebase connection**

Your Event Helper app is now live and accessible from anywhere! 🌐
