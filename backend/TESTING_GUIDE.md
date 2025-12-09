# RentNG Backend - Testing Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/rentng_db"
JWT_ACCESS_SECRET="your-super-secret-access-key-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-chars"
```

### 3. Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate

# Seed sample data
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## 🧪 Testing the API

### Test Credentials (from seed)
```
Tenant User:
  Email: tenant1@rentng.com
  Password: tenant123

Tenant User 2:
  Email: tenant2@rentng.com
  Password: tenant123

Landlord User:
  Email: landlord1@rentng.com
  Password: landlord123

Landlord User 2:
  Email: landlord2@rentng.com
  Password: landlord123

Admin User:
  Email: admin@rentng.com
  Password: admin123
```

---

## 📋 Complete Auth Flow Test

### Step 1: Register New User

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@rentng.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "role": "TENANT"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-id-123",
      "email": "newuser@rentng.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "TENANT",
      "phone": "+2348012345678",
      "profileImage": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Step 2: Login User

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "tenant1@rentng.com",
  "password": "tenant123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "user-id-123",
      "email": "tenant1@rentng.com",
      "firstName": "Oluwaseun",
      "lastName": "Adeyemi",
      "role": "TENANT",
      "phone": "+2348012345678",
      "profileImage": "https://i.pravatar.cc/150?img=1"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Store the `accessToken` for subsequent requests**

---

### Step 3: Get Current User Profile (Protected Route)

**Request:**
```bash
GET /api/auth/me
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "user-id-123",
    "email": "tenant1@rentng.com",
    "firstName": "Oluwaseun",
    "lastName": "Adeyemi",
    "role": "TENANT",
    "phone": "+2348012345678",
    "profileImage": "https://i.pravatar.cc/150?img=1"
  }
}
```

---

### Step 4: Update Profile

**Request:**
```bash
PUT /api/auth/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "Seun",
  "lastName": "Adeyemi",
  "phone": "+2349087654321"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user-id-123",
    "email": "tenant1@rentng.com",
    "firstName": "Seun",
    "lastName": "Adeyemi",
    "role": "TENANT",
    "phone": "+2349087654321",
    "profileImage": "https://i.pravatar.cc/150?img=1"
  }
}
```

---

### Step 5: Change Password

**Request:**
```bash
POST /api/auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "oldPassword": "tenant123",
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Step 6: Refresh Token

**Request:**
```bash
POST /api/auth/refresh
Content-Type: application/json
(Cookie: refreshToken=...)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Step 7: Logout

**Request:**
```bash
POST /api/auth/logout
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🏠 Listing API Tests

### Get All Listings

**Request:**
```bash
GET /api/listings?page=1&limit=20&state=Lagos&minPrice=100000&maxPrice=500000
```

**Response:**
```json
{
  "success": true,
  "message": "Listings fetched successfully",
  "data": {
    "listings": [
      {
        "id": "property-id",
        "name": "Luxury Apartment in Ikoyi",
        "description": "Beautiful 3-bedroom apartment...",
        "address": "25 Bourdillon Road",
        "city": "Lagos",
        "state": "Lagos",
        "minPrice": 350000,
        "reviewCount": 1,
        "avgRating": 5,
        "landlord": {...}
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "pages": 1
    }
  }
}
```

### Get Featured Listings

```bash
GET /api/listings/featured?limit=6
```

### Search Listings

```bash
GET /api/listings/search?q=ikoyi
```

### Get Single Listing

```bash
GET /api/listings/{propertyId}
```

---

## 📅 Booking API Tests

### Create Booking

**Request:**
```bash
POST /api/bookings
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "unitId": "unit-id-123",
  "checkInDate": "2025-01-15T00:00:00Z",
  "checkOutDate": "2025-02-15T00:00:00Z",
  "notes": "Family of 3, will need extra bedding"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking-id",
    "userId": "user-id",
    "unitId": "unit-id",
    "checkInDate": "2025-01-15T00:00:00Z",
    "checkOutDate": "2025-02-15T00:00:00Z",
    "nights": 31,
    "totalPrice": 10850000,
    "status": "PENDING",
    "notes": "Family of 3, will need extra bedding"
  }
}
```

### Get My Bookings

```bash
GET /api/bookings?page=1&limit=20
Authorization: Bearer {accessToken}
```

### Get Landlord's Bookings

```bash
GET /api/bookings/landlord/all?page=1&limit=20
Authorization: Bearer {accessToken}
```

### Get Single Booking

```bash
GET /api/bookings/{bookingId}
Authorization: Bearer {accessToken}
```

### Cancel Booking

```bash
POST /api/bookings/{bookingId}/cancel
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

### Approve Booking (Landlord)

```bash
POST /api/bookings/{bookingId}/approve
Authorization: Bearer {landlordAccessToken}
```

### Reject Booking (Landlord)

```bash
POST /api/bookings/{bookingId}/reject
Authorization: Bearer {landlordAccessToken}
Content-Type: application/json

{
  "reason": "Unit is no longer available"
}
```

### Check Unit Availability

```bash
GET /api/bookings/units/{unitId}/availability?checkInDate=2025-01-15&checkOutDate=2025-02-15
```

---

## 📝 Error Response Examples

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Invalid email"
      }
    ]
  }
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Listing not found"
}
```

---

## 🛠️ Using Postman

### Import Collection

1. Create new Postman collection "RentNG Backend"
2. Add these environment variables:
   - `base_url`: http://localhost:5000
   - `accessToken`: (will be set after login)
   - `refreshToken`: (will be set after login)

### Example Requests

**Login & Save Token:**
```
POST {{base_url}}/api/auth/login
Body (JSON):
{
  "email": "tenant1@rentng.com",
  "password": "tenant123"
}

Tests Tab:
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("accessToken", jsonData.data.accessToken);
}
```

**Protected Request:**
```
GET {{base_url}}/api/auth/me
Headers:
Authorization: Bearer {{accessToken}}
```

---

## ✅ Complete Test Checklist

- [ ] Register new user
- [ ] Login with tenant account
- [ ] Get current user profile
- [ ] Update profile
- [ ] Change password
- [ ] Get all listings with filters
- [ ] Get featured listings
- [ ] Search listings
- [ ] Get single listing detail
- [ ] Create booking as tenant
- [ ] Get my bookings as tenant
- [ ] Get landlord bookings
- [ ] Approve booking as landlord
- [ ] Cancel booking as tenant
- [ ] Check unit availability
- [ ] Refresh token
- [ ] Logout
- [ ] Test unauthorized access (missing token)
- [ ] Test validation errors
- [ ] Test database seeding

---

## 🐛 Troubleshooting

### Database Connection Error
```
Make sure PostgreSQL is running and DATABASE_URL is correct in .env
```

### Token Invalid Error
```
Token may have expired. Use refresh endpoint or login again.
```

### Port Already in Use
```
Change PORT in .env or kill process using port 5000:
lsof -ti:5000 | xargs kill -9
```

### CORS Error
```
Make sure FRONTEND_URL is set in .env
```

---

## 📚 API Documentation

Full API documentation available in `README.md`

Happy testing! 🎉
