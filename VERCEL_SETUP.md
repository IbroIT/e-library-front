# Vercel Environment Variable Setup

## Required Steps

After pushing the latest changes, you need to add an environment variable to your Vercel project:

### 1. Go to Vercel Dashboard
1. Navigate to: https://vercel.com/dashboard
2. Select your `e-library-front` project

### 2. Add Environment Variable
1. Go to **Settings** → **Environment Variables**
2. Add the following variable:

   **Name:** `VITE_API_URL`
   
   **Value:** `https://su-library-back-d2d8d21af2e4.herokuapp.com/api`
   
   **Environment:** Select all environments (Production, Preview, Development)

3. Click **Save**

### 3. Redeploy
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **⋮** (three dots) menu
4. Select **Redeploy**
5. Confirm the redeployment

## What Was Fixed

### 1. React Peer Dependency Conflict ✅
- Downgraded React from v19 to v18
- Compatible with `react-pdf@7.7.3`
- `npm install` will now succeed

### 2. API Fetch Errors ✅
- Unified API URL configuration
- Now uses `VITE_API_URL` environment variable
- Fallback to Heroku URL if not set

### 3. SVG Rendering Errors ✅
- Removed problematic Framer Motion path animations
- SVG waves now use static paths
- No more invalid path data errors

## Verify Deployment

After redeployment, your app should:
- ✅ Build successfully without dependency errors
- ✅ Connect to the backend API correctly
- ✅ Render SVG elements without errors
- ✅ Load books and categories properly

## Local Development

For local development, the `.env` file is already configured with the Heroku URL.
If you want to test with local backend, update `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```
