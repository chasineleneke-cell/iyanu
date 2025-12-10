# Backend Deployment - Quick Start

## 🚀 5-Minute Deployment Guide

### Step 1: Setup Database (Neon) - 2 min
1. Go to https://console.neon.tech
2. Create project → Copy connection string (Prisma format)
3. Save it: `DATABASE_URL="postgresql://..."`

### Step 2: Deploy to Railway - 3 min
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. **Set Root Directory to: `backend`** ⚠️
5. Add environment variables:

```env
DATABASE_URL="your-neon-connection-string"
JWT_ACCESS_SECRET="generate-random-32-chars"
JWT_REFRESH_SECRET="generate-random-32-chars"
NODE_ENV="production"
FRONTEND_URL="https://your-frontend.vercel.app"
```

6. Wait for deployment
7. Copy your backend URL: `https://xxx.railway.app`

### Step 3: Test - 30 sec
Visit: `https://your-backend.railway.app/health`

Should see: `{"success":true,...}` ✅

---

## ⚠️ Important Notes

### Before Deploying:
1. **Update Prisma Schema for PostgreSQL**
   - Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
   - Or Railway will handle this automatically

2. **Generate JWT Secrets**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Run twice to get two different secrets.

3. **Root Directory**
   - Must be set to `backend` in Railway settings
   - Otherwise Railway won't find your `package.json`

### After Deploying:
1. Update `FRONTEND_URL` after deploying frontend
2. Test all endpoints
3. Monitor logs for errors

---

## 📝 Environment Variables Checklist

Copy-paste this list:

- [ ] `DATABASE_URL` - From Neon
- [ ] `JWT_ACCESS_SECRET` - Random 32+ chars
- [ ] `JWT_REFRESH_SECRET` - Random 32+ chars  
- [ ] `JWT_ACCESS_EXPIRES_IN` - "15m"
- [ ] `JWT_REFRESH_EXPIRES_IN` - "7d"
- [ ] `NODE_ENV` - "production"
- [ ] `PORT` - "5000" (or leave default)
- [ ] `FRONTEND_URL` - Your Vercel URL (after frontend deploy)

---

## 🔗 Full Guide

See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.

