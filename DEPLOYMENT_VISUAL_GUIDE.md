# RentNG Deployment Visual Guide

## Overview

```
Your Local Machine
       ↓
   GitHub Repo
       ↓
   ┌───┴─────────────┬──────────────┐
   ↓                 ↓              ↓
Vercel         Railway           Neon
(Frontend)     (Backend)      (Database)
   ↓                 ↓              ↓
Your Domain ← Connected ────→ PostgreSQL
```

## Step 1: GitHub (2 min)

Your code needs to be on GitHub so services can deploy it.

```
Local Project
    ↓ push
GitHub Repository
    ↓
Ready for deployment
```

**What to do:**
- Push your code to GitHub (main branch)
- Vercel and Railway will pull from there

**Result:** Code is on GitHub

---

## Step 2: Neon Database (5 min)

Create PostgreSQL database in the cloud.

```
Neon Console
    ↓
Create Project
    ↓
Get Connection String
    ↓
Copy string for Railway
```

**What you'll get:**
- PostgreSQL database URL
- Format: `postgresql://user:pass@host/dbname?sslmode=require`

**Result:** Database is ready, connection string saved

---

## Step 3: Railway Backend (12 min)

Deploy your Express backend to Railway.

```
Railway Console
    ↓
Connect GitHub
    ↓
Select Repository
    ↓
Auto-build & Deploy
    ↓
Add Environment Variables
    ↓
Backend is LIVE
```

**What happens:**
1. Railway clones your repo
2. Runs `npm run build` in backend/
3. Starts `npm start`
4. Server runs on Railway's infrastructure
5. You get a public URL

**Result:** Backend running at https://your-railway-app.railway.app

---

## Step 4: Vercel Frontend (12 min)

Deploy your Next.js frontend to Vercel.

```
Vercel Console
    ↓
Connect GitHub
    ↓
Select Repository
    ↓
Auto-build & Deploy
    ↓
Add Environment Variables
    ↓
Frontend is LIVE
```

**What happens:**
1. Vercel clones your repo
2. Runs `npm run build` (Next.js build)
3. Optimizes for production
4. Deploys to Vercel's global CDN
5. You get a public URL

**Result:** Frontend running at https://your-vercel-app.vercel.app

---

## Step 5: Connect & Test (5 min)

Link frontend to backend so they can communicate.

```
Frontend (Vercel)
    ↓ API calls
Backend (Railway)
    ↓ Database queries
Database (Neon)
```

**Connection flow:**
1. User enters email/password on frontend
2. Frontend sends POST to backend
3. Backend validates and queries database
4. Database returns user info
5. Backend sends response to frontend
6. Frontend displays result

**Result:** Everything communicates, app is LIVE

---

## Data Flow Diagram

```
                    User's Browser
                          ↓
                     Vercel Frontend
                    (https://your-app.vercel.app)
                          ↓
                    API Request JSON
                          ↓
                    Railway Backend
                    (https://your-api.railway.app/api)
                          ↓
                    Validate & Process
                          ↓
                    Database Query
                          ↓
                    Neon PostgreSQL
                    (postgresql://...)
                          ↓
                    Database Response
                          ↓
                    Backend JSON Response
                          ↓
                    Frontend Displays Data
                          ↓
                    User Sees Result
```

---

## What Each Service Does

### Vercel (Frontend)
```
Your Next.js App
    ↓ (npm run build)
Optimized HTML/CSS/JS
    ↓
Deployed to 200+ global locations
    ↓
Users access from anywhere, get fast response
```

### Railway (Backend)
```
Your Express App
    ↓ (npm run build in backend/)
Compiled JavaScript
    ↓ (npm start)
Server runs 24/7
    ↓
Responds to API requests
    ↓ (queries database)
Returns data to frontend
```

### Neon (Database)
```
PostgreSQL Server
    ↓
Stores all data:
  - Users & passwords
  - Properties & listings
  - Bookings & reviews
  - Messages & payments
    ↓
Available 24/7
    ↓
Automatically backed up
```

---

## URLs After Deployment

```
Frontend:    https://rentnng-prod.vercel.app
Backend:     https://rentnng-backend-prod.railway.app
API:         https://rentnng-backend-prod.railway.app/api
Database:    PostgreSQL on Neon (not public)

User visits frontend URL
    ↓
Frontend makes API calls to backend URL
    ↓
Backend queries database
    ↓
Response goes back to user
```

---

## Environment Variables

### What They Are
- Configuration values your app needs
- Different for development vs production
- Never commit secrets to GitHub
- Stored securely in each service

### Vercel Variables
```
NEXT_PUBLIC_API_URL=https://your-railway-backend/api
(tells frontend where to find backend)
```

### Railway Variables
```
DATABASE_URL=postgresql://...
(tells backend how to connect to database)

JWT_ACCESS_SECRET=your-secret-key
(security token for authentication)

JWT_REFRESH_SECRET=another-secret-key
(security token refresh)

NODE_ENV=production
(tells backend it's in production mode)

FRONTEND_URL=https://your-vercel-frontend.vercel.app
(tells backend where frontend is, for CORS)
```

---

## Common Deployment Issues

### Issue 1: Frontend Can't Reach Backend
```
Error in browser console:
"CORS policy: Cross-origin request blocked"

Fix:
  1. Check NEXT_PUBLIC_API_URL in Vercel
  2. Check FRONTEND_URL in Railway
  3. Redeploy both
```

### Issue 2: Backend Can't Reach Database
```
Error in Railway logs:
"Error: connect ECONNREFUSED"

Fix:
  1. Check DATABASE_URL in Railway
  2. Copy fresh string from Neon
  3. Update in Railway
  4. Redeploy Railway
```

### Issue 3: Login Not Working
```
Error on frontend:
"Unauthorized" or "Invalid credentials"

Fix:
  1. Check JWT secrets are set
  2. Verify database has user
  3. Check Railway logs
```

---

## Monitoring Dashboard

### Vercel Dashboard (Frontend)
```
Shows:
- Build history
- Deployment status
- Real-time logs
- Performance metrics
- Traffic analytics
```

### Railway Dashboard (Backend)
```
Shows:
- Build logs
- Server logs in real-time
- CPU/Memory usage
- Deployment history
- Active connections
```

### Neon Dashboard (Database)
```
Shows:
- Database size
- Connection count
- Query performance
- Backup history
- Usage metrics
```

---

## After Going Live

### Your Responsibilities
1. Monitor logs regularly
2. Check error tracking
3. Ensure backups are working
4. Test critical flows weekly

### Automatic
- Vercel auto-deploys on git push
- Railway auto-redeploys on git push
- Neon auto-backups daily
- SSL certificates auto-renewed

### Optional Enhancements
- Setup Sentry for error tracking
- Setup Datadog for monitoring
- Add custom domain
- Setup automated backups
- Setup alerting

---

## Rollback Timeline

```
Version 1 (current - production)
    ↓
Version 2 (good backup)
    ↓
Version 3 (previous - if needed)

If Version 1 breaks:
  1. Click Rollback on Railway/Vercel
  2. Goes back to Version 2
  3. ~1 minute downtime
  4. Service is restored
```

---

## Security Features (After Deploy)

✓ HTTPS/SSL - Auto enabled on Vercel & Railway
✓ JWT Tokens - Secure authentication
✓ Password Hashing - bcryptjs
✓ CORS - Configured to your frontend only
✓ Rate Limiting - 100 requests/15 minutes
✓ Database - Encrypted connections
✓ Backups - Automatic daily backups

---

## Cost Summary

```
Service         | Free Tier | Pro Tier   | Your Cost
Vercel          | Yes (✓)   | $20+/mo    | $0
Railway         | Yes ($5)  | $10-50/mo  | $5-15
Neon            | Yes (✓)   | $15+/mo    | $0-15
Total Estimate  |           |            | $5-30/mo
```

For a startup, everything can run on free tiers!

---

## Success Checklist

After deployment is complete, verify:

```
☑ Frontend loads without errors
☑ Backend responds to health endpoint
☑ Can register new user
☑ Can login with credentials
☑ Can view listings
☑ Can search and filter
☑ Can create booking
☑ Can view profile
☑ Can update profile
☑ All API calls successful
☑ No 404 or 500 errors
☑ Database has user records
☑ Performance is good (<2s load time)
```

If all boxes checked → **You're Live!** 🎉

---

## Quick Reference URLs

```
Vercel Dashboard:    https://vercel.com/dashboard
Railway Dashboard:   https://railway.app/dashboard
Neon Dashboard:      https://console.neon.tech
GitHub:              https://github.com

Documentation:
Vercel Docs:         https://vercel.com/docs
Railway Docs:        https://railway.app/docs
Neon Docs:           https://neon.tech/docs
Prisma Docs:         https://www.prisma.io/docs
```

---

## You're Ready! 🚀

1. Read DEPLOYMENT_PACKAGE.md
2. Follow the 5 steps
3. Your app goes live in 35 minutes
4. Monitor the dashboards
5. Celebrate! 🎉
