#!/usr/bin/env node

/**
 * PostgreSQL Migration Guide for RentNG
 * This file documents the steps to migrate from SQLite to PostgreSQL
 */

// ===== OPTION 1: Local PostgreSQL Installation =====
console.log(`
========== POSTGRESQL MIGRATION GUIDE ==========

OPTION 1: Local PostgreSQL (Development)
========================================

1. Install PostgreSQL:
   - Windows: https://www.postgresql.org/download/windows/
   - macOS: brew install postgresql@15
   - Linux: sudo apt-get install postgresql postgresql-contrib

2. Create a new database:
   createdb rentnng_db

3. Create a database user:
   createuser rentnng_user --password
   (Set password when prompted)

4. Grant privileges:
   psql -d rentnng_db -c "ALTER USER rentnng_user WITH ALL PRIVILEGES;"

5. Update .env:
   DATABASE_URL="postgresql://rentnng_user:password@localhost:5432/rentnng_db"

6. Run migrations:
   npx prisma migrate deploy

========== OPTION 2: Neon (Serverless PostgreSQL) ==========
(Recommended for production)

1. Go to https://console.neon.tech
2. Sign up and create a project
3. Create a database
4. Copy the connection string
5. Update .env:
   DATABASE_URL="postgresql://..."
6. Run migrations:
   npx prisma migrate deploy

========== OPTION 3: Supabase (PostgreSQL + Auth) ==========

1. Go to https://supabase.com
2. Create a new project
3. Copy the DATABASE_URL from project settings
4. Update .env:
   DATABASE_URL="postgresql://..."
5. Run migrations:
   npx prisma migrate deploy

========== MIGRATION STEPS ==========

1. Backup current SQLite database:
   cp prisma/dev.db prisma/dev.db.backup

2. Update prisma/.env with PostgreSQL URL

3. Create new migration:
   npx prisma migrate dev --name init_postgres

4. Verify schema:
   npx prisma studio

5. Seed database (if needed):
   node prisma/seed.js

6. Test endpoints with new database

========== VERIFY MIGRATION ==========

Run E2E tests after migration:
   node e2e-test.js

Expected results:
- All registration tests should pass
- All listing queries should work
- All booking operations should work

========== ROLLBACK (if needed) ==========

1. Restore .env to SQLite:
   DATABASE_URL="file:./prisma/dev.db"

2. Restore from backup:
   cp prisma/dev.db.backup prisma/dev.db

3. Restart backend

`);
