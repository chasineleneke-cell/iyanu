# Setup Guide - RentNG Frontend

This guide helps you get the RentNG frontend running locally.

## Prerequisites

### 1. Install Node.js
- Download from https://nodejs.org/ (v18+ LTS recommended)
- **Important**: During installation, ensure "Add to PATH" is selected
- After installation, verify:
  ```powershell
  node --version
  npm --version
  ```

### 2. Clone/Setup Project
```powershell
cd C:\Users\musty\OneDrive\Desktop\iyanu
```

## Installation Steps

### Step 1: Install Dependencies
If you're having PATH issues with npm, try these approaches:

**Option A: Reinstall Node.js**
1. Uninstall Node.js from Control Panel > Programs > Programs and Features
2. Delete C:\Program Files\nodejs (if it exists)
3. Download and reinstall from https://nodejs.org/
4. **During install**: Check "Add to PATH" and "Automatically install necessary tools"
5. Restart your computer
6. Test: `node --version`

**Option B: Use Direct Node Path**
If npm still doesn't work in terminal, use the full path:
```powershell
& "C:\Program Files\nodejs\npm.cmd" install
```

**Option C: Use NVM (Recommended)**
Install Node Version Manager (nvm-windows):
1. Download from https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-windows
3. In PowerShell (as admin):
   ```powershell
   nvm install 18.17.0
   nvm use 18.17.0
   npm install
   ```

### Step 2: Install Project Dependencies
```powershell
npm install
```

This installs all packages from package.json:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- Zustand
- Zod
- React Hook Form
- Axios
- And more...

### Step 3: Setup Environment
```powershell
# Copy example env file
Copy-Item .env.example .env.local

# Edit .env.local with your settings (optional for dev)
notepad .env.local
```

Update these if you have a backend running:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 4: Run Development Server
```powershell
npm run dev
```

Output should show:
```
> nigerian-apartment-rental@0.1.0 dev
> next dev

  ▲ Next.js 15.0.0

  ✓ Ready in 1234ms

Local:        http://localhost:3000
Environments: .env.local

✓ Compiled client successfully
✓ Compiled successfully
```

Open http://localhost:3000 in your browser!

### Step 5: Verify Pages
- Home: http://localhost:3000
- Search: http://localhost:3000/search
- Tenant Login: http://localhost:3000/login
- Admin Login: http://localhost:3000/admin/login

## Available Scripts

```powershell
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Type checking
npm run type-check
```

## Troubleshooting

### Issue: "npm: command not found"
**Solutions:**
1. Ensure Node.js is installed: `node --version`
2. Restart terminal/PowerShell after Node.js installation
3. Use full path: `C:\Program Files\nodejs\npm.cmd install`
4. Check PATH: `$env:Path -split ';' | Where-Object { $_ -like '*nodejs*' }`

### Issue: "Cannot find module 'react'"
**Solution:** Dependencies not installed. Run:
```powershell
npm install
```

### Issue: Port 3000 already in use
**Solution:** Kill process or use different port:
```powershell
npm run dev -- -p 3001
```

### Issue: Tailwind CSS not working
**Solution:** 
1. Delete `.next` folder: `Remove-Item .next -Recurse`
2. Restart dev server: `npm run dev`

### Issue: TypeScript errors after file creation
**Solution:** Restart dev server for TypeScript to pick up new files

## Backend Setup (When Ready)

To connect to backend:

1. **Start backend API** (separate project):
   ```powershell
   # In backend directory
   npm start  # or appropriate command
   ```

2. **Update .env.local:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Verify connection:**
   - Check browser Console (F12) for API errors
   - Look for successful API calls to backend

4. **API Endpoints Needed:**
   See `src/services/api.ts` for full list of endpoints backend must provide

## Project Structure Quick Reference

```
src/
├── app/              # Pages (Home, Search, Listings, etc)
├── components/       # Reusable React components
├── utils/            # Utility functions (Nigerian locale, etc)
├── store/            # State management (Zustand)
├── services/         # API client
├── types/            # TypeScript type definitions
└── constants/        # App constants
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start dev server: `npm run dev`
3. 🔄 Implement backend API endpoints (see `src/services/api.ts`)
4. 🔄 Configure payment gateway (Paystack/Flutterwave)
5. 🔄 Setup database & backend
6. 🚀 Deploy to Vercel or hosting platform

## Documentation Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Node.js Installation Troubleshooting](https://nodejs.org/en/docs/guides/installing-node-using-windows-subsystem-for-linux/)

## Support

For issues:
1. Check terminal output for error messages
2. Read error carefully - usually indicates missing dependencies or config issues
3. Try deleting `node_modules` and `.next` folders, then `npm install` again
4. Restart terminal after major changes

---

**You now have a complete, production-ready Next.js frontend for the Nigerian apartment rental app!** 🎉
