# 📋 API Response Formats & Examples

All API endpoints follow a consistent response format. This document shows exactly what to expect.

---

## 📐 Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Human-readable success message",
  "data": {
    // Response data (varies by endpoint)
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human-readable error message",
  "data": null
}
```

---

## 🔐 Authentication Responses

### Register (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "cuid-123456789",
      "email": "user@rentng.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "TENANT",
      "phone": "+2348012345678",
      "profileImage": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Cookie Set:**
- `refreshToken`: httpOnly, secure, 7-day expiry

### Login (200 OK)
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "cuid-123456789",
      "email": "tenant1@rentng.com",
      "firstName": "Oluwaseun",
      "lastName": "Adeyemi",
      "role": "TENANT",
      "phone": "+2348012345678",
      "profileImage": "https://i.pravatar.cc/150?img=1"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User (200 OK)
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "cuid-123456789",
    "email": "tenant1@rentng.com",
    "firstName": "Oluwaseun",
    "lastName": "Adeyemi",
    "role": "TENANT",
    "phone": "+2348012345678",
    "profileImage": "https://i.pravatar.cc/150?img=1"
  }
}
```

### Update Profile (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "cuid-123456789",
    "email": "tenant1@rentng.com",
    "firstName": "Seun",
    "lastName": "Adeyemi",
    "role": "TENANT",
    "phone": "+2349087654321",
    "profileImage": "https://i.pravatar.cc/150?img=1"
  }
}
```

### Change Password (200 OK)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Logout (200 OK)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token (200 OK)
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🏠 Listings Responses

### Get All Listings (200 OK)
```json
{
  "success": true,
  "message": "Listings fetched successfully",
  "data": {
    "listings": [
      {
        "id": "cuid-prop-001",
        "name": "Luxury Apartment in Ikoyi",
        "description": "Beautiful 3-bedroom apartment with amazing city views...",
        "address": "25 Bourdillon Road",
        "city": "Lagos",
        "state": "Lagos",
        "imageUrls": [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
        ],
        "amenities": ["Wi-Fi", "Air Conditioning", "Pool", "Gym"],
        "minPrice": 350000,
        "reviewCount": 5,
        "avgRating": 4.8,
        "landlord": {
          "id": "cuid-user-001",
          "firstName": "Kunle",
          "lastName": "Johnson",
          "profileImage": "https://i.pravatar.cc/150?img=3"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "pages": 3
    }
  }
}
```

### Get Single Listing (200 OK)
```json
{
  "success": true,
  "message": "Listing fetched successfully",
  "data": {
    "id": "cuid-prop-001",
    "name": "Luxury Apartment in Ikoyi",
    "description": "Beautiful 3-bedroom apartment...",
    "address": "25 Bourdillon Road",
    "city": "Lagos",
    "state": "Lagos",
    "imageUrls": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
    "amenities": ["Wi-Fi", "Air Conditioning", "Pool", "Gym", "Security"],
    "landlord": {
      "id": "cuid-user-001",
      "firstName": "Kunle",
      "lastName": "Johnson",
      "phone": "+2349012345678",
      "profileImage": "https://i.pravatar.cc/150?img=3"
    },
    "units": [
      {
        "id": "cuid-unit-001",
        "unitNumber": "Unit 1A",
        "bedroomCount": 3,
        "bathroomCount": 2,
        "size": 150,
        "pricePerMonth": 450000,
        "imageUrls": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
        "amenities": ["Balcony", "Kitchen"],
        "status": "AVAILABLE",
        "bookings": [
          {
            "checkInDate": "2025-02-01T00:00:00Z",
            "checkOutDate": "2025-02-28T00:00:00Z",
            "status": "CONFIRMED"
          }
        ]
      }
    ],
    "reviews": [
      {
        "id": "cuid-review-001",
        "rating": 5,
        "comment": "Excellent property, great location!",
        "user": {
          "firstName": "Oluwaseun",
          "lastName": "Adeyemi",
          "profileImage": "https://i.pravatar.cc/150?img=1"
        },
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ],
    "avgRating": 4.8,
    "reviewCount": 5,
    "createdAt": "2024-12-01T08:00:00Z"
  }
}
```

### Create Property (201 Created)
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": "cuid-prop-new",
    "name": "New Luxury Apartment",
    "description": "Beautiful apartment with modern amenities",
    "address": "100 Lekki Street",
    "city": "Lagos",
    "state": "Lagos",
    "imageUrls": ["https://example.com/image1.jpg"],
    "amenities": ["Wi-Fi", "Air Conditioning"],
    "status": "AVAILABLE",
    "userId": "cuid-user-landlord",
    "createdAt": "2025-01-20T14:30:00Z"
  }
}
```

### Search Listings (200 OK)
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": "cuid-prop-001",
      "name": "Luxury Apartment in Ikoyi",
      "description": "Beautiful 3-bedroom apartment...",
      "address": "25 Bourdillon Road",
      "city": "Lagos",
      "state": "Lagos",
      "minPrice": 350000,
      "reviewCount": 5,
      "avgRating": 4.8,
      "landlord": {
        "id": "cuid-user-001",
        "firstName": "Kunle",
        "lastName": "Johnson"
      }
    }
  ]
}
```

---

## 📅 Booking Responses

### Create Booking (201 Created)
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "cuid-booking-001",
    "userId": "cuid-tenant-001",
    "unitId": "cuid-unit-001",
    "checkInDate": "2025-02-01T00:00:00Z",
    "checkOutDate": "2025-03-01T00:00:00Z",
    "nights": 28,
    "totalPrice": 12600000,
    "status": "PENDING",
    "notes": "Family of 3",
    "unit": {
      "id": "cuid-unit-001",
      "unitNumber": "Unit 1A",
      "bedroomCount": 3,
      "bathroomCount": 2,
      "pricePerMonth": 450000,
      "property": {
        "id": "cuid-prop-001",
        "name": "Luxury Apartment in Ikoyi",
        "address": "25 Bourdillon Road"
      }
    },
    "createdAt": "2025-01-20T14:30:00Z"
  }
}
```

### Get Bookings (200 OK)
```json
{
  "success": true,
  "message": "Bookings fetched successfully",
  "data": {
    "bookings": [
      {
        "id": "cuid-booking-001",
        "userId": "cuid-tenant-001",
        "unitId": "cuid-unit-001",
        "checkInDate": "2025-02-01T00:00:00Z",
        "checkOutDate": "2025-03-01T00:00:00Z",
        "nights": 28,
        "totalPrice": 12600000,
        "status": "CONFIRMED",
        "unit": {
          "id": "cuid-unit-001",
          "pricePerMonth": 450000,
          "property": {
            "id": "cuid-prop-001",
            "name": "Luxury Apartment in Ikoyi",
            "imageUrls": ["https://images.unsplash.com/..."]
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

### Approve Booking (200 OK)
```json
{
  "success": true,
  "message": "Booking approved successfully",
  "data": {
    "id": "cuid-booking-001",
    "status": "CONFIRMED",
    "checkInDate": "2025-02-01T00:00:00Z",
    "checkOutDate": "2025-03-01T00:00:00Z",
    "nights": 28,
    "totalPrice": 12600000
  }
}
```

### Cancel Booking (200 OK)
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "cuid-booking-001",
    "status": "CANCELLED",
    "cancellationReason": "Changed my mind"
  }
}
```

### Check Availability (200 OK)
```json
{
  "success": true,
  "message": "Availability checked",
  "data": {
    "available": true
  }
}
```

---

## ⚠️ Error Responses

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation error",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Invalid email"
      },
      {
        "field": "password",
        "message": "Password must be at least 6 characters"
      }
    ]
  }
}
```

### Unauthorized (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### No Token (401 Unauthorized)
```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

### Forbidden (403 Forbidden)
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Not Found (404 Not Found)
```json
{
  "success": false,
  "message": "Listing not found"
}
```

### Duplicate Email (400 Bad Request)
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### Unit Not Available (400 Bad Request)
```json
{
  "success": false,
  "message": "Unit is not available for the selected dates"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔄 Response Codes Summary

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | GET, PUT, POST with no resource creation |
| 201 | Created | POST that creates a resource |
| 400 | Bad Request | Validation error, bad input |
| 401 | Unauthorized | Missing/invalid token or credentials |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## 💡 Response Field Meanings

| Field | Type | Meaning |
|-------|------|---------|
| `success` | Boolean | Whether operation was successful |
| `message` | String | Human-readable status message |
| `data` | Any | Response data (varies by endpoint) |
| `pagination.page` | Number | Current page (1-indexed) |
| `pagination.limit` | Number | Items per page |
| `pagination.total` | Number | Total items in database |
| `pagination.pages` | Number | Total number of pages |

---

## 🎯 Example Frontend Integration

### Login & Store Token
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

const result = await response.json()

if (result.success) {
  // Store token
  localStorage.setItem('accessToken', result.data.accessToken)
  // Store user
  setUser(result.data.user)
}
```

### Make Authenticated Request
```typescript
const response = await fetch('/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})

const result = await response.json()

if (result.success) {
  console.log('Current user:', result.data)
}
```

### Handle Errors
```typescript
const result = await response.json()

if (!result.success) {
  if (response.status === 401) {
    // Redirect to login
  } else if (response.status === 404) {
    // Show not found message
  } else {
    // Show error message
  }
}
```

---

Made with ❤️ for RentNG
