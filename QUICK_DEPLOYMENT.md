# RentNG Quick Deployment Guide

## TL;DR - Get Live in 30 Minutes

### Prerequisites
- GitHub account
- Vercel account (for frontend)
- Railway account (for backend)
- Neon account (for database)

---

## Step 1: Database Setup (Neon) - 5 min

```bash
# 1. Go to https://console.neon.tech
# 2. Create new project
# 3. Create database "rentnng"
# 4. Copy connection string

# Update backend/.env:
DATABASE_URL="postgresql://user:pass@host/rentnng"
```

---

## Step 2: Backend Deployment (Railway) - 10 min

```bash
# 1. Go to https://railway.app
# 2. New Project > GitHub Repo
# 3. Select your RentNG repo
# 4. Add environment variables:
#    - DATABASE_URL (from Neon)
#    - JWT_ACCESS_SECRET (any random string)
#    - JWT_REFRESH_SECRET (any random string)
#    - NODE_ENV=production
#    - FRONTEND_URL=https://your-vercel-app.com

# 5. Deploy automatically triggers
# 6. Get your backend URL: https://<project>.railway.app
```

---

## Step 3: Frontend Deployment (Vercel) - 10 min

```bash
# Update .env.local:
NEXT_PUBLIC_API_URL=https://<your-railway-backend>.railway.app/api

# 1. Go to https://vercel.com
# 2. New Project > GitHub Repo
# 3. Select your RentNG repo
# 4. Add Environment Variable:
#    - NEXT_PUBLIC_API_URL = https://<railway-backend>/api

# 5. Deploy
# 6. Get your frontend URL: https://<project>.vercel.app
```

---

## Step 4: Verify Production - 5 min

```bash
# Test backend health
curl https://<your-backend>/health

# Test registration
curl -X POST https://<your-backend>/api/auth/register \
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

# Visit frontend
# https://your-app.vercel.app
```

---

## Environment Variables Checklist

### Backend (Railway)
- [ ] DATABASE_URL
- [ ] JWT_ACCESS_SECRET
- [ ] JWT_REFRESH_SECRET
- [ ] NODE_ENV=production
- [ ] FRONTEND_URL
- [ ] PORT (auto-set by Railway)

### Frontend (Vercel)
- [ ] NEXT_PUBLIC_API_URL

---

## Troubleshooting

### CORS Error
- Verify FRONTEND_URL in backend matches your Vercel domain

### Database Connection Fails
- Check PostgreSQL connection string format: `postgresql://user:pass@host:5432/dbname`
- Verify Neon IP whitelist (should allow all by default)

### Login Not Working
- Ensure JWT secrets are different and long enough
- Check backend logs on Railway dashboard

### Slow Performance
- Check Railway CPU/Memory usage
- Enable Neon autoscaling if needed

---

## Monitoring

### Railway Dashboard
- Real-time logs
- CPU/Memory graphs
- Deployment history
- Error tracking

### Vercel Dashboard
- Build logs
- Web Analytics
- Error tracking
- Performance metrics

### Neon Dashboard
- Query analytics
- Connection monitoring
- Database size

---

## Support URLs

- Railway: https://railway.app/docs
- Vercel: https://vercel.com/docs
- Neon: https://neon.tech/docs
- Prisma: https://www.prisma.io/docs/

---

## Rollback Instructions

### Backend Rollback (Railway)
1. Go to Railway dashboard
2. Click Deployments
3. Select previous deployment
4. Click "Rollback"

### Frontend Rollback (Vercel)
1. Go to Vercel dashboard
2. Click Deployments
3. Select previous deployment
4. Click "Promote to Production"

---

## Next: Custom Domain (Optional)

### Frontend (Vercel)
1. Settings > Domains
2. Add your domain
3. Update DNS records
4. Verify

### Backend (Railway)
1. Settings > Domains
2. Add custom domain
3. Configure DNS

---

## Estimated Costs (Monthly)

- **Neon**: $0 (free tier) or $15+ (pro)
- **Railway**: $5 (free tier) or pay-as-you-go
- **Vercel**: $0 (free tier) or $20+ (pro)
- **Total**: $0-40/month for production

---

**Ready to deploy?**

Start with Neon, then Railway, then Vercel. Should take 30 minutes total.

Questions? Check DEPLOYMENT_GUIDE_PRODUCTION.md for detailed instructions.
