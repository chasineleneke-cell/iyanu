# 🧪 Backend API - cURL Testing Commands

Quick reference for testing API endpoints using cURL (works on Windows PowerShell, macOS, Linux)

---

## 🔐 Authentication Tests

### 1. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@rentng.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+2348012345678",
    "role": "TENANT"
  }'
```

### 2. Login (Get Access Token)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tenant1@rentng.com",
    "password": "tenant123"
  }'
```

**Save the `accessToken` from response for next requests**

### 3. Get Current User (Protected)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Update Profile

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "UpdatedName",
    "phone": "+2349087654321"
  }'
```

### 5. Change Password

```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "tenant123",
    "newPassword": "newpassword123"
  }'
```

### 6. Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🏠 Listings Tests

### 1. Get All Listings

```bash
curl "http://localhost:5000/api/listings?page=1&limit=10"
```

### 2. Get All Listings with Filters

```bash
curl "http://localhost:5000/api/listings?state=Lagos&minPrice=100000&maxPrice=500000&page=1&limit=10"
```

### 3. Get Featured Listings

```bash
curl "http://localhost:5000/api/listings/featured?limit=6"
```

### 4. Search Listings

```bash
curl "http://localhost:5000/api/listings/search?q=ikoyi"
```

### 5. Get Single Listing

```bash
curl "http://localhost:5000/api/listings/PROPERTY_ID"
```

### 6. Create Property (Landlord Only)

```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer LANDLORD_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Luxury Apartment",
    "description": "Beautiful apartment with modern amenities",
    "address": "100 Lekki Street",
    "city": "Lagos",
    "state": "Lagos",
    "imageUrls": ["https://example.com/image1.jpg"],
    "amenities": ["Wi-Fi", "Air Conditioning", "Pool"]
  }'
```

### 7. Get My Listings (Landlord Only)

```bash
curl -X GET "http://localhost:5000/api/listings/my-listings?page=1&limit=10" \
  -H "Authorization: Bearer LANDLORD_ACCESS_TOKEN"
```

### 8. Update Property (Landlord Only)

```bash
curl -X PUT http://localhost:5000/api/listings/PROPERTY_ID \
  -H "Authorization: Bearer LANDLORD_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Property Name",
    "description": "Updated description",
    "amenities": ["Wi-Fi", "Parking"]
  }'
```

### 9. Add Unit to Property (Landlord Only)

```bash
curl -X POST http://localhost:5000/api/listings/PROPERTY_ID/units \
  -H "Authorization: Bearer LANDLORD_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "unitNumber": "Unit 1A",
    "bedroomCount": 3,
    "bathroomCount": 2,
    "size": 150,
    "pricePerMonth": 450000,
    "imageUrls": ["https://example.com/image.jpg"],
    "amenities": ["Balcony", "Kitchen"]
  }'
```

---

## 📅 Bookings Tests

### 1. Create Booking (Tenant Only)

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer TENANT_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "unitId": "UNIT_ID",
    "checkInDate": "2025-02-01T00:00:00Z",
    "checkOutDate": "2025-03-01T00:00:00Z",
    "notes": "Family of 3"
  }'
```

### 2. Get My Bookings (Tenant)

```bash
curl -X GET "http://localhost:5000/api/bookings?page=1&limit=10" \
  -H "Authorization: Bearer TENANT_ACCESS_TOKEN"
```

### 3. Get Landlord Bookings

```bash
curl -X GET "http://localhost:5000/api/bookings/landlord/all?page=1&limit=10" \
  -H "Authorization: Bearer LANDLORD_ACCESS_TOKEN"
```

### 4. Get Single Booking

```bash
curl -X GET http://localhost:5000/api/bookings/BOOKING_ID \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### 5. Cancel Booking (Tenant)

```bash
curl -X POST http://localhost:5000/api/bookings/BOOKING_ID/cancel \
  -H "Authorization: Bearer TENANT_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Changed my mind"
  }'
```

### 6. Approve Booking (Landlord)

```bash
curl -X POST http://localhost:5000/api/bookings/BOOKING_ID/approve \
  -H "Authorization: Bearer LANDLORD_ACCESS_TOKEN"
```

### 7. Reject Booking (Landlord)

```bash
curl -X POST http://localhost:5000/api/bookings/BOOKING_ID/reject \
  -H "Authorization: Bearer LANDLORD_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Unit no longer available"
  }'
```

### 8. Check Unit Availability

```bash
curl "http://localhost:5000/api/bookings/units/UNIT_ID/availability?checkInDate=2025-02-01&checkOutDate=2025-03-01"
```

---

## 🔗 Health Check

### Check if server is running

```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

---

## 📝 PowerShell Examples

### Windows PowerShell Login Example

```powershell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body @{
    email = "tenant1@rentng.com"
    password = "tenant123"
  } | ConvertFrom-Json

$accessToken = $loginResponse.data.accessToken

# Use token in next request
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
  -Method Get `
  -Headers @{"Authorization"="Bearer $accessToken"}
```

---

## 🚀 Quick Test Sequence

1. **Check Server**
```bash
curl http://localhost:5000/health
```

2. **Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@rentng.com","password":"test123","firstName":"Test","lastName":"User","phone":"+2348012345678","role":"TENANT"}'
```

3. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tenant1@rentng.com","password":"tenant123"}'
```

4. **Get Profile** (replace TOKEN with actual token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

5. **Get Listings**
```bash
curl "http://localhost:5000/api/listings?page=1&limit=5"
```

---

## 🔑 Environment Variables

Create variables to avoid repetition:

### macOS/Linux
```bash
API="http://localhost:5000"
TENANT_TOKEN="your_tenant_token_here"
LANDLORD_TOKEN="your_landlord_token_here"

# Usage:
curl "$API/api/auth/me" -H "Authorization: Bearer $TENANT_TOKEN"
```

### Windows PowerShell
```powershell
$API = "http://localhost:5000"
$TENANT_TOKEN = "your_tenant_token_here"
$LANDLORD_TOKEN = "your_landlord_token_here"

# Usage:
Invoke-RestMethod -Uri "$API/api/auth/me" `
  -Headers @{"Authorization"="Bearer $TENANT_TOKEN"}
```

---

## 📋 Expected Response Format

All responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## ⚠️ Common Errors

### 401 Unauthorized
```
Missing or invalid Authorization header
Solution: Include Bearer token in headers
```

### 400 Bad Request
```
Validation failed
Solution: Check request body against schema
```

### 404 Not Found
```
Resource not found
Solution: Verify ID is correct
```

### 500 Internal Server Error
```
Database or server error
Solution: Check server logs
```

---

Happy Testing! 🎉
