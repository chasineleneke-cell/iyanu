# Deployment Guide for RentNG Frontend

This guide covers deploying the RentNG frontend to production environments.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel account (recommended) or your preferred hosting provider
- Environment variables configured

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.rentng.app

# App Configuration
NEXT_PUBLIC_APP_NAME=RentNG
NEXT_PUBLIC_APP_URL=https://rentng.app

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Deployment to Vercel (Recommended)

Vercel is the recommended platform for Next.js apps and offers seamless integration.

### 1. Connect Your Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 2. Set Environment Variables in Vercel Dashboard

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add all variables from `.env.local`
4. Make sure to add them to Production, Preview, and Development environments

### 3. Build Settings

Vercel automatically detects Next.js apps. Ensure:
- **Framework**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Node Version**: 18 or higher

## Deployment to Other Platforms

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --build
```

**Note**: Requires `netlify.toml` configuration.

### Self-Hosted (VPS/Docker)

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Use PM2 for process management:
```bash
npm i -g pm2
pm2 start npm --name "rentng" -- start
pm2 startup
pm2 save
```

## Pre-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] API endpoints are pointing to production backend
- [ ] Cloudinary credentials are configured
- [ ] Build completes without errors: `npm run build`
- [ ] No console errors in production build
- [ ] Images are optimized
- [ ] SEO metadata is correctly configured
- [ ] Security headers are set (if self-hosted)
- [ ] CORS is properly configured on backend
- [ ] SSL/TLS certificate is valid (HTTPS)
- [ ] Analytics tracking is enabled
- [ ] Error monitoring (e.g., Sentry) is configured

## Performance Optimization

### Image Optimization

Next.js automatically optimizes images. Ensure:

```typescript
// Always use Next.js Image component
import Image from 'next/image'

<Image
  src={url}
  alt="Description"
  width={400}
  height={300}
  priority={false} // Set to true only for above-the-fold images
/>
```

### Bundle Analysis

Analyze your bundle size:

```bash
npm i --save-dev @next/bundle-analyzer

# Then run: ANALYZE=true npm run build
```

### Remove Console Logs

In production, console logs should be removed or filtered:

```typescript
// Use this pattern in production
if (process.env.NODE_ENV !== 'production') {
  console.log('Debug info')
}
```

## Monitoring & Error Tracking

### Sentry Setup

1. Install Sentry:
```bash
npm install @sentry/nextjs
```

2. Initialize in `instrumentation.ts` or `pages/_app.tsx`:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

3. Add to `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/project-id
```

### Analytics

Set up Google Analytics or your preferred analytics service:

```typescript
// In app/layout.tsx
import Script from 'next/script'

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

## Debugging Production Issues

### Check Vercel Logs

```bash
vercel logs --prod
```

### Check Build Logs

```bash
vercel logs --build
```

### Run Production Build Locally

```bash
npm run build
npm start
```

Visit `http://localhost:3000` and test thoroughly.

## Security Considerations

1. **API Keys**: Never commit sensitive data. Use environment variables.
2. **CORS**: Configure CORS on your backend properly.
3. **CSRF Protection**: Implement CSRF tokens if needed.
4. **Rate Limiting**: Use backend rate limiting.
5. **Input Validation**: Always validate on frontend AND backend.
6. **HTTPS**: Always use HTTPS in production.
7. **Content Security Policy**: Add CSP headers.

## Performance Metrics

Monitor these Core Web Vitals:

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

View these in Vercel Analytics dashboard or Google PageSpeed Insights.

## Rollback Procedure

### On Vercel

```bash
vercel rollback --prod
```

Select the previous deployment to revert to.

### Manual Rollback

```bash
# View deployment history
vercel list

# Promote previous deployment to production
vercel promote <deployment-url>
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

## Support & Troubleshooting

For common issues:

1. **Build fails**: Check Node version, dependencies, and build command
2. **Environment variables not working**: Ensure they're prefixed with `NEXT_PUBLIC_` for client-side access
3. **Images not loading**: Check image domain configuration and Cloudinary credentials
4. **API calls failing**: Verify CORS configuration and API endpoint URLs
5. **Performance issues**: Use Vercel Analytics or PageSpeed Insights to identify bottlenecks

## Documentation Links

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Cloudinary Setup](https://cloudinary.com/documentation)
- [Core Web Vitals](https://web.dev/vitals/)
