# RentNG Backend API

A production-ready, fully-typed REST API backend for the RentNG apartment rental platform built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**.

## 🚀 Features

- ✅ **JWT Authentication** - Access & refresh tokens, secure password hashing
- ✅ **Role-Based Access Control** - Tenant, Landlord, Admin roles
- ✅ **Complete API** - 30+ REST endpoints
- ✅ **Type Safety** - Full TypeScript support with Zod validation
- ✅ **Database** - PostgreSQL with Prisma ORM
- ✅ **Error Handling** - Consistent error responses
- ✅ **Rate Limiting** - Built-in API rate limiting
- ✅ **CORS** - Configured for frontend integration
- ✅ **Production Ready** - Clean architecture, scalable

## 📦 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript 5
- **ORM**: Prisma 5
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: bcrypt, cors, rate-limit
- **File Upload**: Multer (Cloudinary ready)

## 🎯 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` with:
- PostgreSQL connection string
- JWT secrets (generate random 32+ char strings)
- Cloudinary credentials (optional)
- Paystack keys (optional)

### 3. Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "state": "Lagos",
  "userType": "TENANT"
}

Response:
{
  "user": { "id", "email", "role", ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}

Response:
{
  "user": { "id", "email", "role", ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Listing Endpoints

#### Search Listings
```http
GET /listings?state=Lagos&minPrice=100000&maxPrice=500000&bedrooms=2
Authorization: Bearer <accessToken>

Response:
{
  "data": [ { "id", "name", "price", ... } ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

#### Get Listing Details
```http
GET /listings/:id
```

#### Get Listing Reviews
```http
GET /listings/:id/reviews
```

### Property Management (Landlord)

#### Create Property
```http
POST /admin/properties
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Downtown Apartments",
  "description": "Modern 2-bedroom apartment...",
  "address": "123 Main Street",
  "city": "Lagos",
  "state": "Lagos",
  "amenities": ["WiFi", "Parking", "Pool"],
  "imageUrls": ["https://..."]
}
```

#### Add Unit to Property
```http
POST /admin/properties/:propertyId/units
Authorization: Bearer <accessToken>

{
  "unitNumber": "A101",
  "bedroomCount": 2,
  "bathroomCount": 1,
  "size": 95,
  "pricePerMonth": 250000,
  "amenities": ["AC", "Fan", "Fridge"]
}
```

### Booking Endpoints

#### Create Booking
```http
POST /bookings
Authorization: Bearer <accessToken>

{
  "propertyId": "...",
  "unitId": "...",
  "checkInDate": "2025-01-15T00:00:00Z",
  "checkOutDate": "2025-02-15T00:00:00Z",
  "notes": "Looking forward to this!"
}
```

#### Get My Bookings
```http
GET /bookings
Authorization: Bearer <accessToken>
```

#### Cancel Booking
```http
POST /bookings/:bookingId/cancel
Authorization: Bearer <accessToken>

{
  "reason": "Change of plans"
}
```

#### Submit Review
```http
POST /bookings/:bookingId/review
Authorization: Bearer <accessToken>

{
  "rating": 5,
  "title": "Great apartment!",
  "comment": "Clean, spacious, and well-maintained...",
  "cleanliness": 5,
  "accuracy": 5,
  "communication": 5
}
```

### Landlord Booking Management

#### Get Booking Requests
```http
GET /admin/bookings
Authorization: Bearer <accessToken>
```

#### Approve Booking
```http
POST /admin/bookings/:bookingId/approve
Authorization: Bearer <accessToken>
```

#### Reject Booking
```http
POST /admin/bookings/:bookingId/reject
Authorization: Bearer <accessToken>

{
  "reason": "Unit not available"
}
```

### Messaging

#### Get Conversations
```http
GET /messages
Authorization: Bearer <accessToken>
```

#### Send Message
```http
POST /messages
Authorization: Bearer <accessToken>

{
  "recipientId": "...",
  "content": "Hi! I'm interested in your apartment..."
}
```

#### Mark Message as Read
```http
PUT /messages/:messageId/read
Authorization: Bearer <accessToken>
```

### Payments

#### Initialize Payment
```http
POST /payments/initialize
Authorization: Bearer <accessToken>

{
  "bookingId": "...",
  "amount": 250000
}

Response:
{
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "..."
}
```

#### Verify Payment
```http
POST /payments/verify
Authorization: Bearer <accessToken>

{
  "reference": "..."
}
```

#### Payment History
```http
GET /payments/history
Authorization: Bearer <accessToken>
```

### Admin Dashboard

#### Get Statistics
```http
GET /admin/dashboard
Authorization: Bearer <accessToken> (Admin only)

Response:
{
  "totalUsers": 1250,
  "totalProperties": 85,
  "totalBookings": 342,
  "totalRevenue": 125000000,
  "revenueThisMonth": 8500000,
  "pendingBookings": 23
}
```

## 🏗️ Architecture

### Folder Structure
```
src/
├── controllers/      # Request handlers, validation
├── services/         # Business logic, database queries
├── routes/           # Route definitions
├── middlewares/      # Auth, error handling
├── utils/           # Helpers (JWT, hash, validation)
├── types/           # TypeScript interfaces
├── app.ts           # Express config
└── server.ts        # Entry point
```

### Request Flow
```
Route → Middleware → Controller → Service → Prisma → Database
        ↓           ↓          ↓
      Auth      Validation   Business
      Error                  Logic
```

## 🔐 Authentication

### Token Storage (Frontend)
- Access token: Memory or localStorage (frontend handles)
- Refresh token: httpOnly cookie (middleware sets)

### Authorization Header
```
Authorization: Bearer <accessToken>
```

### Token Refresh Flow
1. Access token expires (15m default)
2. Frontend sends refresh token
3. Backend validates and returns new access token
4. Frontend updates Authorization header

## 📊 Database Schema

### Core Tables
- **User** - User accounts (tenant/landlord/admin)
- **TenantProfile** - Tenant additional info
- **LandlordProfile** - Landlord business info
- **Property** - Apartment listings
- **Unit** - Individual units/rooms
- **Booking** - Booking requests
- **Review** - Unit reviews by tenants
- **Message** - Direct messages
- **Payment** - Payment transactions
- **AdminLog** - Audit logs

### Relations
```
User (1) ←→ (many) Booking
User (1) ←→ (many) Property (Landlord)
Property (1) ←→ (many) Unit
Unit (1) ←→ (many) Booking
Booking (1) ←→ (1) Review
Booking (1) ←→ (1) Payment
User (1) ←→ (many) Message (Sender/Receiver)
```

## ✅ Validation

All endpoints validate input using Zod schemas:

```typescript
// Example: Registration validation
{
  "email": "must be valid email",
  "password": "min 6 characters",
  "firstName": "min 2 characters",
  "phone": "must be valid phone format",
  "state": "must be valid Nigerian state"
}
```

## ❌ Error Handling

Standard error response format:
```json
{
  "error": "Error message",
  "details": {}
}
```

### Status Codes
- `400` - Validation/Bad Request
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
All `.env` variables must be set:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_ACCESS_SECRET` - Strong random string (32+ chars)
- `JWT_REFRESH_SECRET` - Strong random string (32+ chars)
- `FRONTEND_URL` - Frontend domain (for CORS)
- `CLOUDINARY_*` - File upload (optional)
- `PAYSTACK_*` - Payments (optional)

### Database Migration
```bash
npx prisma migrate deploy
```

## 📝 Available Scripts

```bash
npm run dev                 # Start dev server
npm run build              # Build TypeScript
npm start                  # Run production build
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Create migrations
npm run prisma:push        # Push schema to DB
npm run prisma:studio      # Open Prisma Studio
npm run type-check         # TypeScript checking
npm run lint               # ESLint
```

## 🔧 Frontend Integration

### 1. Set API URL
```typescript
// frontend/.env.local
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

### 2. Login Request
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  credentials: 'include', // For cookies
})

const { accessToken, refreshToken } = await response.json()
```

### 3. Authenticated Request
```typescript
const response = await fetch('/api/bookings', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
})
```

## 🐛 Troubleshooting

### "Cannot find module '@/types'"
```bash
npm install
```

### "Database connection failed"
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify credentials

### "Prisma client not generated"
```bash
npm run prisma:generate
```

### Port 5000 in use
```bash
# macOS/Linux
lsof -i :5000 | awk 'NR!=1 {print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 📖 Documentation

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Zod Validation](https://zod.dev/)
- [JWT.io](https://jwt.io/)

## 📝 License

MIT

## 👥 Support

For issues or questions:
1. Check `.env` setup
2. Review database connection
3. Check console logs
4. Verify request format

---

**Backend ready for development! 🚀**

Build with ❤️ for Nigeria's rental market.
