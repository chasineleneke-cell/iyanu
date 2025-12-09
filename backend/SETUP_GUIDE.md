# RentNG Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Run migrations
npm run prisma:generate
npm run prisma:migrate

# (Optional) View database
npm run prisma:studio
```

### 3. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

---

## Environment Setup

### Database (PostgreSQL)
```
DATABASE_URL="postgresql://user:password@localhost:5432/rentng_db"
```

### JWT Configuration
```
JWT_ACCESS_SECRET="min-32-character-random-string"
JWT_REFRESH_SECRET="min-32-character-random-string"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

### Cloudinary (File Upload)
```
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Paystack (Payments)
```
PAYSTACK_PUBLIC_KEY="pk_test_xxx"
PAYSTACK_SECRET_KEY="sk_test_xxx"
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (optional)
- `POST /api/auth/refresh` - Refresh access token

### Listings
- `GET /api/listings` - Search/filter listings
- `GET /api/listings/:id` - Get listing details
- `GET /api/listings/:id/reviews` - Get listing reviews

### Admin - Properties
- `POST /api/admin/properties` - Create property
- `GET /api/admin/properties` - Get landlord's properties
- `PUT /api/admin/properties/:id` - Update property
- `DELETE /api/admin/properties/:id` - Delete property
- `POST /api/admin/properties/:id/units` - Add unit
- `PUT /api/admin/properties/:propertyId/units/:unitId` - Update unit
- `DELETE /api/admin/properties/:propertyId/units/:unitId` - Delete unit

### Bookings (Tenant)
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/review` - Submit review

### Bookings (Landlord)
- `GET /api/admin/bookings` - Get booking requests
- `POST /api/admin/bookings/:id/approve` - Approve booking
- `POST /api/admin/bookings/:id/reject` - Reject booking

### Messaging
- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read

### Payments
- `POST /api/payments/initialize` - Initialize payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history

### Admin Dashboard
- `GET /api/admin/dashboard` - Get statistics

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/avatar` - Upload avatar
- `PUT /api/profile/password` - Change password

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   ├── middlewares/       # Auth, error handling
│   ├── utils/             # Helpers (JWT, hash, validation)
│   ├── prisma/            # Database client
│   ├── types/             # TypeScript interfaces
│   ├── app.ts             # Express config
│   └── server.ts          # Entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── dist/                  # Compiled output
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build & Run
npm run build           # Compile TypeScript
npm start               # Run production build

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:push     # Push schema to database
npm run prisma:studio   # Open Prisma Studio

# Code Quality
npm run type-check      # Type checking
npm run lint            # ESLint
```

---

## Authentication Flow

### Registration
1. User submits email, password, name, phone, state
2. Backend validates input (Zod schema)
3. Check if user already exists
4. Hash password with bcrypt
5. Create user in database
6. Generate JWT tokens
7. Return access + refresh tokens

### Login
1. User submits email + password
2. Validate input
3. Find user by email
4. Compare password
5. Generate tokens
6. Return tokens to frontend

### Token Refresh
1. Frontend sends refresh token
2. Backend verifies refresh token
3. If valid, generate new access token
4. Return new access token

---

## Database Schema

### Core Tables
- **User** - Tenant/Landlord/Admin accounts
- **TenantProfile** - Additional tenant info
- **LandlordProfile** - Additional landlord info
- **Property** - Apartment/Property listings
- **Unit** - Individual apartments/rooms
- **Booking** - Booking requests
- **Review** - Unit reviews
- **Message** - Direct messages
- **Payment** - Payment transactions
- **AdminLog** - Audit logs

---

## Error Handling

All errors return standard format:
```json
{
  "error": "Error message",
  "details": {}
}
```

Status codes:
- `400` - Validation error
- `401` - Authentication error (invalid token)
- `403` - Authorization error (insufficient permissions)
- `404` - Not found
- `409` - Conflict (duplicate email, etc)
- `500` - Server error

---

## Frontend Integration

### Set API URL
In frontend `.env.local`:
```
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

### Login Flow
1. Frontend sends credentials to `/auth/login`
2. Receives access + refresh tokens
3. Stores tokens in httpOnly cookies (via middleware)
4. Sends access token in `Authorization: Bearer <token>` header

---

## Deployment

### Prerequisites
- PostgreSQL database
- Node.js 18+
- npm or yarn

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
Set all `.env` variables in production:
- Database URL
- JWT secrets (strong random values)
- Cloudinary credentials
- Paystack credentials
- Frontend URL (for CORS)

### Database Migration
```bash
npx prisma migrate deploy
```

---

## Troubleshooting

### "Cannot find module '@/types'"
- Run `npm install`
- Check `tsconfig.json` paths

### "Database connection failed"
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check credentials

### "Port 5000 already in use"
- Kill process: `lsof -i :5000 | kill -9 <PID>`
- Or change `PORT` in `.env`

### JWT token errors
- Verify `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set
- Token may have expired
- Check token format in header

---

## Support

For issues or questions:
1. Check `.env` configuration
2. Review console logs
3. Check database connectivity
4. Verify request format matches Zod schema

---

**Backend is ready for development! 🚀**
