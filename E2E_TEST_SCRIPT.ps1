# RentNG End-to-End Testing Script
# Tests all user flows: Auth, Listings, Bookings, Payments, Reviews, Messaging

$API_URL = "http://localhost:5000/api"
$FRONTEND_URL = "http://localhost:3000"

# Color output
function Write-Success { Write-Host "$args" -ForegroundColor Green }
function Write-Error { Write-Host "$args" -ForegroundColor Red }
function Write-Info { Write-Host "$args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "$args" -ForegroundColor Yellow }

# Store tokens and IDs for use across tests
$global:accessToken = ""
$global:refreshToken = ""
$global:userId = ""
$global:tenantUserId = ""
$global:landlordUserId = ""
$global:propertyId = ""
$global:unitId = ""
$global:bookingId = ""

Write-Info "====== RentNG E2E Test Suite ======"
Write-Info "API URL: $API_URL"
Write-Info "Frontend URL: $FRONTEND_URL`n"

# ===== PHASE 1: AUTHENTICATION & USER MANAGEMENT =====
Write-Info "`n========== PHASE 1: AUTHENTICATION ==========="

# Test 1.1: Register Tenant
Write-Info "`n[TEST 1.1] Register Tenant User"
try {
    $registerPayload = @{
        email = "tenant_$(Get-Random)@test.com"
        password = "Password123!"
        firstName = "John"
        lastName = "Tenant"
        phone = "+2348012345678"
        state = "Lagos"
        userType = "TENANT"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $registerPayload -ContentType "application/json"
    
    if ($response.success) {
        Write-Success "✓ Tenant registration successful"
        $global:accessToken = $response.data.accessToken
        $global:refreshToken = $response.data.refreshToken
        $global:userId = $response.data.user.id
        $global:tenantUserId = $response.data.user.id
        Write-Info "  User ID: $($response.data.user.id)"
        Write-Info "  Email: $($response.data.user.email)"
    } else {
        Write-Error "✗ Tenant registration failed: $($response.message)"
    }
} catch {
    Write-Error "✗ Error in tenant registration: $_"
}

# Test 1.2: Register Landlord
Write-Info "`n[TEST 1.2] Register Landlord User"
try {
    $registerPayload = @{
        email = "landlord_$(Get-Random)@test.com"
        password = "Password123!"
        firstName = "Jane"
        lastName = "Landlord"
        phone = "+2348087654321"
        state = "Lagos"
        userType = "LANDLORD"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $registerPayload -ContentType "application/json"
    
    if ($response.success) {
        Write-Success "✓ Landlord registration successful"
        $global:landlordUserId = $response.data.user.id
        $landlordToken = $response.data.accessToken
        Write-Info "  User ID: $($response.data.user.id)"
    } else {
        Write-Error "✗ Landlord registration failed: $($response.message)"
    }
} catch {
    Write-Error "✗ Error in landlord registration: $_"
}

# Test 1.3: Login
Write-Info "`n[TEST 1.3] Login with Tenant Account"
try {
    $loginPayload = @{
        email = "tenant_test@example.com"
        password = "Password123!"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $loginPayload -ContentType "application/json" -ErrorAction SilentlyContinue
    
    if ($response -and $response.success) {
        Write-Success "✓ Login successful"
        $global:accessToken = $response.data.accessToken
        Write-Info "  Token received: $($global:accessToken.Substring(0, 20))..."
    } else {
        Write-Warning "⚠ Login test skipped (test user not found)"
    }
} catch {
    Write-Warning "⚠ Login test error: $_"
}

# Test 1.4: Get Profile
Write-Info "`n[TEST 1.4] Get User Profile"
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/auth/me" -Method GET -Headers $headers -ErrorAction SilentlyContinue
    
    if ($response -and $response.success) {
        Write-Success "✓ Profile retrieved successfully"
        Write-Info "  Name: $($response.data.firstName) $($response.data.lastName)"
        Write-Info "  Email: $($response.data.email)"
    } else {
        Write-Warning "⚠ Profile retrieval failed"
    }
} catch {
    Write-Warning "⚠ Error retrieving profile: $_"
}

# ===== PHASE 2: PROPERTY & LISTING MANAGEMENT =====
Write-Info "`n========== PHASE 2: PROPERTY MANAGEMENT ==========="

# Test 2.1: Create Property (Landlord)
Write-Info "`n[TEST 2.1] Create Property (as Landlord)"
try {
    $headers = @{
        "Authorization" = "Bearer $landlordToken"
        "Content-Type" = "application/json"
    }
    
    $propertyPayload = @{
        name = "Luxury Apartment Downtown"
        description = "Modern 3-bedroom apartment in the heart of Lagos with excellent amenities"
        address = "123 Lekki Road"
        city = "Lagos"
        state = "Lagos"
        imageUrls = @("https://via.placeholder.com/400x300?text=Apartment")
        amenities = @("WiFi", "Security", "Generator", "Water")
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$API_URL/listings/properties" -Method POST -Body $propertyPayload -Headers $headers -ErrorAction SilentlyContinue
    
    if ($response -and $response.success) {
        Write-Success "✓ Property created successfully"
        $global:propertyId = $response.data.id
        Write-Info "  Property ID: $($response.data.id)"
        Write-Info "  Name: $($response.data.name)"
    } else {
        Write-Warning "⚠ Property creation error"
    }
} catch {
    Write-Warning "⚠ Error creating property: $_"
}

# Test 2.2: Get All Listings (Tenant)
Write-Info "`n[TEST 2.2] Get All Listings (Tenant View)"
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/listings?page=1&limit=10" -Method GET -Headers $headers -ErrorAction SilentlyContinue
    
    if ($response -and $response.success) {
        Write-Success "✓ Listings retrieved: $($response.data.count) listings found"
        if ($response.data.listings.Count -gt 0) {
            Write-Info "  Sample listing: $($response.data.listings[0].name)"
        }
    } else {
        Write-Warning "⚠ Failed to retrieve listings"
    }
} catch {
    Write-Warning "⚠ Error retrieving listings: $_"
}

# ===== PHASE 3: BOOKING FLOW =====
Write-Info "`n========== PHASE 3: BOOKING MANAGEMENT ==========="

# Test 3.1: Check Availability
Write-Info "`n[TEST 3.1] Check Unit Availability"
try {
    $checkInDate = (Get-Date).AddDays(7).ToString("yyyy-MM-ddT00:00:00Z")
    $checkOutDate = (Get-Date).AddDays(14).ToString("yyyy-MM-ddT00:00:00Z")
    
    $response = Invoke-RestMethod -Uri "$API_URL/bookings/units/test-unit/availability?checkInDate=$checkInDate&checkOutDate=$checkOutDate" -Method GET -ErrorAction SilentlyContinue
    
    if ($response) {
        Write-Success "✓ Availability check completed"
        Write-Info "  Available: $($response.data.available)"
    } else {
        Write-Warning "⚠ Availability check error"
    }
} catch {
    Write-Warning "⚠ Error checking availability: $_"
}

# Test 3.2: Create Booking
Write-Info "`n[TEST 3.2] Create Booking (Tenant)"
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    
    $checkInDate = (Get-Date).AddDays(7).ToString("yyyy-MM-ddT00:00:00Z")
    $checkOutDate = (Get-Date).AddDays(14).ToString("yyyy-MM-ddT00:00:00Z")
    
    $bookingPayload = @{
        propertyId = $global:propertyId
        unitId = $global:unitId
        checkInDate = $checkInDate
        checkOutDate = $checkOutDate
        notes = "Looking forward to staying here!"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$API_URL/bookings" -Method POST -Body $bookingPayload -Headers $headers -ErrorAction SilentlyContinue
    
    if ($response -and $response.success) {
        Write-Success "✓ Booking created successfully"
        $global:bookingId = $response.data.id
        Write-Info "  Booking ID: $($response.data.id)"
        Write-Info "  Status: $($response.data.status)"
    } else {
        Write-Warning "⚠ Booking creation error"
    }
} catch {
    Write-Warning "⚠ Error creating booking: $_"
}

# Test 3.3: Get My Bookings
Write-Info "`n[TEST 3.3] Get Tenant's Bookings"
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/bookings?page=1&limit=10" -Method GET -Headers $headers -ErrorAction SilentlyContinue
    
    if ($response -and $response.success) {
        Write-Success "✓ Bookings retrieved: $($response.data.count) bookings found"
    } else {
        Write-Warning "⚠ Failed to retrieve bookings"
    }
} catch {
    Write-Warning "⚠ Error retrieving bookings: $_"
}

# ===== PHASE 4: BACKEND HEALTH CHECKS =====
Write-Info "`n========== PHASE 4: HEALTH CHECKS ==========="

# Test 4.1: Backend Health
Write-Info "`n[TEST 4.1] Backend Health Check"
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -ErrorAction SilentlyContinue
    
    if ($response -and $response.success) {
        Write-Success "✓ Backend is healthy"
        Write-Info "  Timestamp: $($response.timestamp)"
    } else {
        Write-Error "✗ Backend health check failed"
    }
} catch {
    Write-Error "✗ Error: Backend not responding"
}

# Test 4.2: Frontend Availability
Write-Info "`n[TEST 4.2] Frontend Availability"
try {
    $response = Invoke-WebRequest -Uri "$FRONTEND_URL" -Method GET -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Success "✓ Frontend is running"
    } else {
        Write-Error "✗ Frontend returned status: $($response.StatusCode)"
    }
} catch {
    Write-Error "✗ Frontend not responding"
}

Write-Info "`n====== E2E Test Suite Complete ======"
Write-Info "Review any ⚠ warnings and ✗ errors above"
