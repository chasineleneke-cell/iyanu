# RentNG Production Deployment - Step by Step

## Prerequisites
- [ ] GitHub repository pushed (public or private)
- [ ] Vercel account (vercel.com)
- [ ] Railway account (railway.app)
- [ ] Neon account (console.neon.tech)

---

## Phase 1: PostgreSQL Database (5 minutes)

### 1.1 Create Neon Project
```
1. Go to https://console.neon.tech
2. Click "New Project"
3. Name: rentnng-prod
4. Choose PostgreSQL 15
5. Create
```

### 1.2 Get Connection String
```
In Neon dashboard:
1. Go to "Connection strings"
2. Select "Prisma" from dropdown
3. Copy the connection string (looks like):
   postgresql://user:password@host/dbname?sslmode=require
```

### 1.3 Save to File
```bash
# Create or update: backend/.env.production
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NODE_ENV="production"
JWT_ACCESS_SECRET="your-random-secret-here"
JWT_REFRESH_SECRET="your-another-random-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

---

## Phase 2: Backend Deployment to Railway (10 minutes)

### 2.1 Prepare Backend

```bash
cd backend

# Verify build works
npm run build

# Check that dist/ was created
ls dist/

# Return to root
cd ..
```

### 2.2 Push to GitHub (if not already)

```bash
git add .
git commit -m "Production deployment setup"
git push origin main
```

### 2.3 Deploy to Railway

```
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway access to GitHub
5. Select your RentNG repository
6. Wait for automatic detection
7. Click "Deploy"
```

### 2.4 Configure Environment Variables

```
1. In Railway dashboard, go to Variables
2. Add these variables:

DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=<your-random-secret>
JWT_REFRESH_SECRET=<your-another-random-secret>
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app (update after Vercel)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.5 Get Backend URL

```
1. Go to Deployments in Railway
2. Click on active deployment
3. Copy the URL (format: https://rentnng-backend-prod.railway.app)
4. Save this URL - you'll need it for frontend
```

**Your backend is now live!** 🎉

Test it:
```bash
curl https://your-railway-backend.railway.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-08T..."
}
```

---

## Phase 3: Frontend Deployment to Vercel (10 minutes)

### 3.1 Update Frontend .env

```bash
# Update: .env.production
NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app/api
```

### 3.2 Push Changes

```bash
git add .env.production
git commit -m "Update backend URL for production"
git push origin main
```

### 3.3 Deploy to Vercel

```
1. Go to https://vercel.com
2. Click "New Project"
3. Click "Import GitHub Repository"
4. Select your RentNG repo
5. Framework Preset: Next.js (auto-selected)
6. Click "Deploy"
```

### 3.4 Configure Environment Variables

```
1. Before deploying (or after in Settings):
2. Add Environment Variable:

Variable: NEXT_PUBLIC_API_URL
Value: https://your-railway-backend.railway.app/api
```

### 3.5 Get Frontend URL

```
1. After deployment completes
2. Click the URL shown (format: https://rentnng-prod.vercel.app)
3. Save this URL
```

**Your frontend is now live!** 🎉

---

## Phase 4: Link Frontend & Backend (5 minutes)

### 4.1 Update Railway with Frontend URL

Go back to Railway:
```
1. Go to Variables
2. Update or add:

Variable: FRONTEND_URL
Value: https://your-vercel-frontend.vercel.app

3. This triggers a redeploy (auto)
```

### 4.2 Verify CORS is Working

Test from your frontend URL:
```bash
# In browser console at https://your-vercel-frontend.vercel.app
fetch('https://your-railway-backend.railway.app/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer dummy-token',
    'Content-Type': 'application/json'
  }
})
```

Should get a response (even if 401 - that's normal for missing token).

---

## Phase 5: Verify Production (5 minutes)

### 5.1 Test Health Endpoint

```bash
curl https://your-railway-backend.railway.app/health
```

Expected:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

### 5.2 Test Registration

```bash
curl -X POST https://your-railway-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+2348012345678",
    "state": "Lagos",
    "userType": "TENANT"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "testuser@example.com",
      ...
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### 5.3 Test Frontend Registration

1. Visit your Vercel URL: `https://your-vercel-frontend.vercel.app`
2. Go to Register page
3. Fill out form
4. Click Register
5. Should see success message

### 5.4 Test Frontend Login

1. Go to Login page
2. Login with the account just created
3. Should redirect to dashboard
4. Check if listings load

---

## Production URLs

Save these URLs:

```
Frontend: https://your-frontend.vercel.app
Backend: https://your-backend.railway.app
Database: Neon PostgreSQL (console.neon.tech)

Environment Variables are in:
- Vercel: Project Settings > Environment Variables
- Railway: Project Settings > Variables
- Neon: Project Settings
```

---

## Monitoring & Maintenance

### Railway Dashboard
- Check real-time logs
- Monitor CPU/Memory
- View deployment history
- See any errors

### Vercel Dashboard
- Check build logs
- View analytics
- Monitor errors
- Check performance

### Neon Dashboard
- View database metrics
- Monitor connections
- Check query performance
- Setup backups

---

## Common Issues & Solutions

### Issue: CORS Error in Frontend

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check FRONTEND_URL in Railway backend variables
2. Should match your exact Vercel frontend URL
3. Redeploy Railway after updating

### Issue: Database Connection Failed

**Error**: `Error: connect ECONNREFUSED`

**Solution**:
1. Check DATABASE_URL in Railway variables
2. Verify Neon connection string format
3. Ensure IP is whitelisted in Neon (should be automatic)

### Issue: Invalid JWT Secrets

**Error**: `Error: JWT_ACCESS_SECRET not set`

**Solution**:
1. Go to Railway Variables
2. Ensure JWT_ACCESS_SECRET is set
3. Redeploy Railway

### Issue: Frontend Shows 404

**Error**: `Vercel shows 404 page`

**Solution**:
1. Check that Next.js build was successful
2. Verify in Vercel > Deployments
3. Check build logs for errors

### Issue: Can't Login in Production

**Error**: `Credentials invalid` after successful registration

**Solution**:
1. Verify CORS is working (test with curl)
2. Check browser DevTools > Network tab
3. Verify JWT secrets match between dev and prod
4. Check Railway logs for errors

---

## Rollback Procedure

### Rollback Backend (Railway)

```
1. Go to Railway dashboard
2. Click Deployments
3. Find previous working deployment
4. Click menu (•••)
5. Click "Rollback"
6. Backend reverts to previous version
```

### Rollback Frontend (Vercel)

```
1. Go to Vercel dashboard
2. Go to Deployments
3. Find previous working deployment
4. Click menu
5. Click "Promote to Production"
6. Frontend reverts to previous version
```

---

## Next Steps

1. ✓ Backend deployed to Railway
2. ✓ Frontend deployed to Vercel
3. ✓ Database setup on Neon
4. Setup custom domain (optional)
5. Enable analytics
6. Setup error tracking (Sentry)
7. Enable monitoring (Datadog)

---

## Estimated Costs (Monthly)

- **Neon PostgreSQL**: $0 (free tier) or $15+ (production)
- **Railway**: $5 (free tier) or $10-50 (depending on usage)
- **Vercel**: $0 (pro) or $20+ (if needed)
- **Total**: $5-50/month

---

## Support

If you get stuck:
1. Check Railway/Vercel/Neon dashboards for error logs
2. Review console output for specific errors
3. Verify all environment variables are set
4. Check if ports/services are accessible

Good luck! Your app should be live now! 🚀
