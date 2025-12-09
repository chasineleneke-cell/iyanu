# RentNG Deployment Guide

## Overview
This guide covers deploying the RentNG full-stack application to production using:
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway or Render (Node.js/Express)
- **Database**: Neon or Supabase (PostgreSQL)

---

## Phase 1: Database Setup (Neon PostgreSQL)

### Step 1: Create Neon Project
1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Sign up with GitHub/Email
3. Create a new project: "rentnng-production"
4. Choose PostgreSQL 15
5. Copy the connection string (looks like: `postgresql://user:password@host/dbname`)

### Step 2: Update Backend .env
```bash
# Update backend/.env
DATABASE_URL="postgresql://user:password@host/dbname"
NODE_ENV="production"
PORT=3000
JWT_ACCESS_SECRET="your-very-secure-random-string-here"
JWT_REFRESH_SECRET="your-another-very-secure-random-string-here"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
FRONTEND_URL="https://your-frontend-domain.com"
```

### Step 3: Run Prisma Migrations
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

---

## Phase 2: Backend Deployment (Railway)

### Step 1: Prepare Backend
```bash
cd backend
npm run build
```

### Step 2: Create Railway Account
1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 3: Connect GitHub Repository
1. Click "New Project"
2. Select "GitHub Repo"
3. Authorize Railway to access your GitHub
4. Select your RentNG repository

### Step 4: Configure Environment Variables
In Railway dashboard:
- Go to "Variables"
- Add all variables from backend/.env:
  - DATABASE_URL
  - JWT_ACCESS_SECRET
  - JWT_REFRESH_SECRET
  - NODE_ENV=production
  - FRONTEND_URL
  - PORT=3000

### Step 5: Deploy
- Railway auto-deploys on push to main branch
- Or manually trigger deploy in dashboard
- Your backend will be available at: `https://<project-name>.railway.app`

### Step 6: Update Frontend .env
```bash
NEXT_PUBLIC_API_URL=https://<your-railway-backend>.railway.app/api
```

---

## Phase 3: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
```bash
npm run build
npm start  # Test locally
```

### Step 2: Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Install Vercel for GitHub

### Step 3: Deploy
1. Click "New Project"
2. Select GitHub repository
3. Framework: Next.js (auto-detected)
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: https://<your-railway-backend>.railway.app/api
5. Click "Deploy"

### Step 4: Custom Domain (Optional)
1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Follow DNS instructions

---

## Phase 4: Verify Production Deployment

### Backend Health Check
```bash
curl https://<your-backend-url>/health
# Expected: { "success": true, "message": "Server is running" }
```

### Test Registration
```bash
curl -X POST https://<your-backend-url>/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+2348012345678",
    "state": "Lagos",
    "userType": "TENANT"
  }'
```

### Test Frontend
1. Visit your Vercel frontend URL
2. Try to register
3. Try to login
4. Verify API calls work

---

## Phase 5: Production Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=3000
JWT_ACCESS_SECRET=<generate-random-string>
JWT_REFRESH_SECRET=<generate-random-string>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend-url/api
```

---

## Phase 6: Monitoring & Maintenance

### Railway Monitoring
- Dashboard shows memory/CPU usage
- Logs available in real-time
- Auto-scaling configured

### Vercel Analytics
- Go to Analytics tab
- Monitor page performance
- Check error logs

### Database Monitoring (Neon)
- Dashboard shows query performance
- Connection count
- Database size

---

## Phase 7: Common Issues & Solutions

### Issue: CORS Error
**Solution**: Ensure FRONTEND_URL is set correctly in backend .env
```
FRONTEND_URL=https://your-exact-frontend-domain.com
```

### Issue: Database Connection Timeout
**Solution**: Check PostgreSQL connection string format
```
postgresql://user:password@host:5432/dbname
```

### Issue: Missing Environment Variables
**Solution**: Verify all required vars are set in deployment platform

### Issue: SSL Certificate Error
**Solution**: Both Railway and Vercel provide SSL automatically

---

## Rollback Procedure

### Rollback Backend
```bash
# In Railway dashboard:
1. Go to Deployments
2. Click on previous deployment
3. Click "Rollback"
```

### Rollback Frontend
```bash
# In Vercel dashboard:
1. Go to Deployments
2. Click on previous deployment
3. Click "Promote to Production"
```

---

## Next Steps

1. ✓ Setup Neon PostgreSQL database
2. ✓ Deploy backend to Railway
3. ✓ Deploy frontend to Vercel
4. ✓ Configure custom domain
5. ✓ Setup monitoring and alerts
6. ✓ Enable backups and recovery
7. Document support procedures
