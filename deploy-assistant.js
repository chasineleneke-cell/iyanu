#!/usr/bin/env node

/**
 * RentNG Deployment Setup Assistant
 * Guides through deployment to Vercel, Railway, and Neon
 */

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  header: (msg) => console.log(`\x1b[1m\n========== ${msg} ==========\x1b[0m`),
};

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(`\x1b[33m${question}\x1b[0m `, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.clear();
  log.header('RentNG Production Deployment Setup');

  log.info('This assistant will guide you through deploying RentNG in 30 minutes.');
  log.info('You will need: GitHub account, Vercel account, Railway account, Neon account\n');

  // Step 1: Database Setup
  log.header('STEP 1: Database Setup (Neon)');
  
  log.info('Go to https://console.neon.tech');
  log.info('1. Sign in with GitHub or create account');
  log.info('2. Create new project named "rentnng-prod"');
  log.info('3. Create database "rentnng_db"');
  log.info('4. Copy the connection string\n');

  const dbUrl = await askQuestion('Paste your Neon PostgreSQL connection string:');
  
  if (!dbUrl.includes('postgresql://')) {
    log.error('Invalid connection string format');
    rl.close();
    return;
  }

  log.success('PostgreSQL connection string saved');

  // Step 2: Backend Setup
  log.header('STEP 2: Backend Configuration');

  const jwtSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const jwtRefreshSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  log.info('Generated JWT secrets for security');

  const backendEnv = `# RentNG Backend - Production Environment

# Database
DATABASE_URL="${dbUrl}"

# JWT Secrets
JWT_ACCESS_SECRET="${jwtSecret}"
JWT_REFRESH_SECRET="${jwtRefreshSecret}"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
NODE_ENV="production"
PORT=3000
API_URL="https://<your-railway-backend>.railway.app"
FRONTEND_URL="https://<your-vercel-frontend>.vercel.app"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync('backend/.env.production', backendEnv);
  log.success('Created backend/.env.production');

  // Step 3: Frontend Setup
  log.header('STEP 3: Frontend Configuration');

  const frontendEnv = `NEXT_PUBLIC_API_URL=https://<your-railway-backend>.railway.app/api
`;

  fs.writeFileSync('.env.production', frontendEnv);
  log.success('Created .env.production');

  // Step 4: Deployment Instructions
  log.header('STEP 4: Deploy Backend (Railway)');

  log.info('1. Go to https://railway.app');
  log.info('2. Sign in with GitHub');
  log.info('3. Create new project > GitHub Repo');
  log.info('4. Select your RentNG repository');
  log.info('5. Go to Settings > Variables');
  log.info('6. Add these variables from backend/.env.production:\n');

  log.warn('DATABASE_URL=' + dbUrl.substring(0, 40) + '...');
  log.warn('JWT_ACCESS_SECRET=' + jwtSecret.substring(0, 20) + '...');
  log.warn('JWT_REFRESH_SECRET=' + jwtRefreshSecret.substring(0, 20) + '...');
  log.warn('NODE_ENV=production');
  log.warn('FRONTEND_URL=(you will update this after Vercel deploy)\n');

  log.info('7. Railway will auto-deploy');
  log.info('8. Copy your backend URL: https://<project-name>.railway.app\n');

  const backendUrl = await askQuestion('After Railway deploy, paste your backend URL:');

  // Step 5: Update Frontend with Backend URL
  log.header('STEP 5: Update Frontend with Backend URL');

  const updatedFrontendEnv = `NEXT_PUBLIC_API_URL=${backendUrl}/api
`;

  fs.writeFileSync('.env.production', updatedFrontendEnv);
  log.success('Updated .env.production with backend URL');

  // Step 6: Deploy Frontend
  log.header('STEP 6: Deploy Frontend (Vercel)');

  log.info('1. Go to https://vercel.com');
  log.info('2. Sign in with GitHub');
  log.info('3. Create new project > Select RentNG repository');
  log.info('4. Framework preset: Next.js (auto-detected)');
  log.info('5. Go to Environment Variables');
  log.info('6. Add this variable:\n');

  log.warn('NEXT_PUBLIC_API_URL=' + backendUrl + '/api\n');

  log.info('7. Click Deploy');
  log.info('8. Copy your frontend URL: https://<project-name>.vercel.app\n');

  const frontendUrl = await askQuestion('After Vercel deploy, paste your frontend URL:');

  // Step 7: Update Railway with Frontend URL
  log.header('STEP 7: Update Railway with Frontend URL');

  log.info('Go back to Railway dashboard');
  log.info('1. Go to Variables');
  log.info('2. Update FRONTEND_URL to: ' + frontendUrl);
  log.info('3. This redeploys your backend\n');

  const deployed = await askQuestion('Have you updated Railway with the frontend URL? (yes/no):');

  if (deployed.toLowerCase() !== 'yes') {
    log.warn('Please complete this step before continuing');
    rl.close();
    return;
  }

  // Step 8: Verification
  log.header('STEP 8: Verification');

  log.info('Testing your production deployment...\n');

  log.info('1. Test backend health:');
  log.warn(`   curl ${backendUrl}/health\n`);

  log.info('2. Visit your frontend:');
  log.warn(`   ${frontendUrl}\n`);

  log.info('3. Test registration flow:');
  log.warn(`   POST ${backendUrl}/api/auth/register\n`);

  log.info('4. Run E2E tests:');
  log.warn(`   Update e2e-test.js with production URLs and run\n`);

  // Final Summary
  log.header('Deployment Complete!');

  log.success(`
PRODUCTION URLs:
  Frontend: ${frontendUrl}
  Backend: ${backendUrl}
  Database: Neon PostgreSQL

NEXT STEPS:
  1. Test all functionality in production
  2. Setup custom domains (optional)
  3. Enable analytics and monitoring
  4. Configure automatic backups
  5. Add SSL certificates (auto via Railway/Vercel)

MONITORING:
  Railway: ${backendUrl}/admin (check logs)
  Vercel: https://vercel.com (check analytics)
  Neon: https://console.neon.tech (check database)
  `);

  log.success('Your RentNG application is now LIVE in production!');

  rl.close();
}

main().catch((err) => {
  log.error(`Error: ${err.message}`);
  rl.close();
  process.exit(1);
});
