# Backend Deployment Guide

Complete step-by-step guide to deploy the RentNG backend to production.

## 🎯 Overview

This guide covers deploying your backend to **Railway** (recommended) or **Render**. Both platforms offer:
- Free tier for testing
- Automatic deployments from GitHub
- Environment variable management
- PostgreSQL database support

---

## 📋 Prerequisites

- [ ] GitHub account (github.com)
- [ ] Railway account (railway.app) OR Render account (render.com)
- [ ] Neon account (console.neon.tech) for PostgreSQL database
- [ ] Your code pushed to GitHub

---

## 🗄️ Step 1: Setup PostgreSQL Database (Neon)

### Why Neon?
- Free tier with 512MB storage
- Automatic backups
- Prisma-compatible connection strings
- No credit card required

### Steps:

1. **Go to Neon Console**
   - Visit: https://console.neon.tech
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Name: `rentng-prod` (or your preferred name)
   - PostgreSQL Version: **15** (recommended)
   - Region: Choose closest to your users
   - Click "Create Project"

3. **Get Connection String**
   - Wait for project to initialize (~30 seconds)
   - Go to "Connection Details" or "Connection String"
   - Select **"Prisma"** format (important!)
   - Copy the connection string
   - Format: `postgresql://user:password@host/dbname?sslmode=require`

4. **Save Connection String**
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/rentng?sslmode=require"
   ```
   ⚠️ **SAVE THIS** - You'll need it in Step 3!

---

## 🚂 Step 2: Deploy Backend to Railway

### Option A: Railway (Recommended)

#### Why Railway?
- Free $5 credit monthly
- Auto-deploys from GitHub
- Easy environment variable management
- Built-in PostgreSQL support (optional)

#### Steps:

1. **Go to Railway**
   - Visit: https://railway.app
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access GitHub (if first time)
   - Select your repository (the one with your RentNG code)
   - Click "Deploy"

3. **Configure Service**
   - Railway will auto-detect it's a Node.js project
   - **Root Directory**: Set to `backend` (important!)
   - Railway will start building automatically

4. **Wait for Build** (2-3 minutes)
   - Watch the build logs
   - Look for: "Build successful" or "Deployment successful"
   - If build fails, check logs for errors

5. **Set Environment Variables**
   - Go to your service → "Variables" tab
   - Add these variables:

   ```env
   # Database (from Step 1)
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/rentng?sslmode=require"

   # JWT Secrets (generate strong random strings)
   JWT_ACCESS_SECRET="your-super-secret-access-key-min-32-characters-long"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-characters-long"
   JWT_ACCESS_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"

   # Server Configuration
   NODE_ENV="production"
   PORT="5000"

   # Frontend URL (update after deploying frontend)
   FRONTEND_URL="https://your-frontend.vercel.app"
   ```

   **How to generate JWT secrets:**
   ```bash
   # Option 1: Use Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Option 2: Use online generator
   # Visit: https://randomkeygen.com/
   # Use "CodeIgniter Encryption Keys"
   ```

6. **Configure Build Settings**
   - Go to "Settings" → "Build"
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

7. **Run Database Migrations**
   - Go to "Deployments" → Click on latest deployment
   - Click "View Logs"
   - You may need to run migrations manually:
   
   **Option 1: Add to package.json scripts**
   ```json
   "postbuild": "prisma generate && prisma migrate deploy"
   ```
   
   **Option 2: Use Railway's Nixpacks**
   - Railway should auto-detect Prisma
   - If not, add `nixpacks.toml` in backend folder:
   ```toml
   [phases.setup]
   nixPkgs = ["nodejs-18_x"]

   [phases.install]
   cmds = ["npm install"]

   [phases.build]
   cmds = ["npm run build", "npx prisma generate", "npx prisma migrate deploy"]

   [start]
   cmd = "npm start"
   ```

8. **Get Your Backend URL**
   - Go to "Settings" → "Domains"
   - Railway provides a default domain: `https://your-project.up.railway.app`
   - Copy this URL
   - ⚠️ **SAVE THIS** - You'll need it for frontend!

9. **Test Backend**
   - Visit: `https://your-backend.up.railway.app/health`
   - Should see: `{"success":true,"message":"Server is running",...}`
   - If you see this, backend is working! ✅

---

### Option B: Render (Alternative)

#### Steps:

1. **Go to Render**
   - Visit: https://render.com
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**
   - **Name**: `rentng-backend`
   - **Region**: Choose closest to users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   - Scroll to "Environment Variables"
   - Add the same variables as Railway (see Step 2, #5 above)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Render will provide a URL: `https://rentng-backend.onrender.com`

6. **Test Backend**
   - Visit: `https://your-backend.onrender.com/health`
   - Should see success response

---

## 🔧 Step 3: Post-Deployment Setup

### 1. Run Database Migrations

If migrations didn't run automatically:

**Via Railway CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run npx prisma migrate deploy
```

**Via Render Shell:**
- Go to your service → "Shell"
- Run: `npx prisma migrate deploy`

### 2. Seed Database (Optional)

If you have seed data:
```bash
railway run npm run prisma:seed
# OR on Render shell:
npm run prisma:seed
```

### 3. Update Frontend URL

After deploying frontend (Vercel), update backend:
- Go to Railway/Render → Environment Variables
- Update `FRONTEND_URL` to your Vercel URL
- Service will auto-redeploy

---

## ✅ Step 4: Verify Deployment

### Health Check
```bash
curl https://your-backend.up.railway.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Registration Endpoint
```bash
curl -X POST https://your-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+2348012345678",
    "state": "Lagos",
    "role": "TENANT"
  }'
```

Expected: `201 Created` with user data and access token.

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Check `package.json` has all dependencies
- Ensure `node_modules` is in `.gitignore`
- Railway/Render will install from `package.json`

**Error: "Prisma Client not generated"**
- Add to build command: `npx prisma generate`
- Or add postinstall script in `package.json`:
  ```json
  "postinstall": "prisma generate"
  ```

### Database Connection Fails

**Error: "Can't reach database server"**
- Check `DATABASE_URL` is correct
- Ensure Neon project is active
- Verify connection string uses `?sslmode=require`
- Check Neon dashboard for connection limits

**Error: "Schema not found"**
- Run migrations: `npx prisma migrate deploy`
- Check Prisma schema is in `backend/prisma/schema.prisma`

### Server Won't Start

**Error: "Port already in use"**
- Railway/Render sets `PORT` automatically
- Don't hardcode port in code
- Use: `const PORT = process.env.PORT || 5000`

**Error: "JWT secret missing"**
- Check all JWT environment variables are set
- Ensure secrets are at least 32 characters

### CORS Errors

**Error: "CORS policy blocked"**
- Update `FRONTEND_URL` in backend environment variables
- Ensure frontend URL matches exactly (no trailing slash)
- Backend will auto-redeploy after variable change

---

## 📊 Monitoring

### Railway
- **Logs**: Service → "Deployments" → Click deployment → "View Logs"
- **Metrics**: Service → "Metrics" tab
- **Alerts**: Set up in "Settings" → "Notifications"

### Render
- **Logs**: Service → "Logs" tab
- **Metrics**: Service → "Metrics" tab
- **Alerts**: Set up in "Settings" → "Alerts"

---

## 🔐 Security Checklist

- [ ] JWT secrets are strong (32+ characters, random)
- [ ] `NODE_ENV=production` is set
- [ ] Database connection uses SSL (`?sslmode=require`)
- [ ] `FRONTEND_URL` is set correctly for CORS
- [ ] No sensitive data in code (use environment variables)
- [ ] Rate limiting is enabled (already in code)
- [ ] HTTPS is enabled (Railway/Render provide automatically)

---

## 🚀 Next Steps

After backend is deployed:

1. **Deploy Frontend** (Vercel)
   - Use backend URL in `NEXT_PUBLIC_API_URL`
   - See frontend deployment guide

2. **Update Backend CORS**
   - Add frontend URL to `FRONTEND_URL` variable
   - Backend will auto-redeploy

3. **Test Full Flow**
   - Register user
   - Login
   - Create listing
   - Make booking

---

## 📝 Environment Variables Summary

```env
# Required
DATABASE_URL="postgresql://..."
JWT_ACCESS_SECRET="min-32-chars"
JWT_REFRESH_SECRET="min-32-chars"
NODE_ENV="production"
FRONTEND_URL="https://your-frontend.vercel.app"

# Optional
PORT="5000"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
PAYSTACK_PUBLIC_KEY="pk_live_xxx"
PAYSTACK_SECRET_KEY="sk_live_xxx"
```

---

## 🆘 Support

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

**Your backend is now live! 🎉**

Backend URL: `https://your-backend.up.railway.app`
API Base: `https://your-backend.up.railway.app/api`

