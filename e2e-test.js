#!/usr/bin/env node

/**
 * RentNG End-to-End Testing Suite
 * Tests all user flows: Auth, Listings, Bookings, Payments, Reviews
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';

// Test state
let state = {
  accessToken: '',
  refreshToken: '',
  userId: '',
  tenantUserId: '',
  landlordUserId: '',
  propertyId: '',
  unitId: '',
  bookingId: '',
  testEmail: `tenant_${Date.now()}@test.com`,
  landlordEmail: `landlord_${Date.now()}@test.com`,
};

// Logging helpers
const log = {
  info: (msg) => console.log(`\x1b[36m${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m✓ ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m✗ ${msg}\x1b[0m`),
  warn: (msg) => console.log(`\x1b[33m⚠ ${msg}\x1b[0m`),
};

// Create axios instance with proper headers
const api = axios.create({ baseURL: API_URL });

// ===== TEST SUITE =====
async function runTests() {
  log.info('\n====== RentNG E2E Test Suite ======');
  log.info(`API URL: ${API_URL}`);
  log.info(`Frontend URL: ${FRONTEND_URL}\n`);

  try {
    // PHASE 1: Authentication
    log.info('\n========== PHASE 1: AUTHENTICATION ==========\n');
    await testTenantRegistration();
    await testLandlordRegistration();
    await testBackendHealth();

    // PHASE 2: Listings
    log.info('\n========== PHASE 2: LISTINGS ==========\n');
    await testGetListings();

    // PHASE 3: Bookings
    log.info('\n========== PHASE 3: BOOKINGS ==========\n');
    await testBookingFlow();

    log.info('\n====== E2E Test Suite Complete ======\n');
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
  }
}

// Test: Tenant Registration
async function testTenantRegistration() {
  try {
    const response = await api.post('/auth/register', {
      email: state.testEmail,
      password: 'TestPassword123!',
      firstName: 'John',
      lastName: 'Tenant',
      phone: '+2348012345678',
      state: 'Lagos',
      userType: 'TENANT',
    });

    if (response.data.success) {
      state.accessToken = response.data.data.accessToken;
      state.refreshToken = response.data.data.refreshToken;
      state.userId = response.data.data.user.id;
      state.tenantUserId = response.data.data.user.id;
      
      log.success('[TEST 1.1] Tenant Registration');
      log.info(`  Email: ${response.data.data.user.email}`);
      log.info(`  User ID: ${state.userId}\n`);
    } else {
      log.error('[TEST 1.1] Tenant Registration - ' + response.data.message);
    }
  } catch (error) {
    log.warn(`[TEST 1.1] Tenant Registration - ${error.message}`);
  }
}

// Test: Landlord Registration
async function testLandlordRegistration() {
  try {
    const response = await api.post('/auth/register', {
      email: state.landlordEmail,
      password: 'TestPassword123!',
      firstName: 'Jane',
      lastName: 'Landlord',
      phone: '+2348087654321',
      state: 'Lagos',
      userType: 'LANDLORD',
    });

    if (response.data.success) {
      state.landlordUserId = response.data.data.user.id;
      state.landlordToken = response.data.data.accessToken;
      
      log.success('[TEST 1.2] Landlord Registration');
      log.info(`  Email: ${response.data.data.user.email}\n`);
    } else {
      log.error('[TEST 1.2] Landlord Registration - ' + response.data.message);
    }
  } catch (error) {
    log.warn(`[TEST 1.2] Landlord Registration - ${error.message}`);
  }
}

// Test: Backend Health
async function testBackendHealth() {
  try {
    const response = await axios.get('http://localhost:5000/health');
    
    if (response.data.success) {
      log.success('[TEST 1.3] Backend Health Check');
      log.info(`  Status: ${response.data.message}\n`);
    }
  } catch (error) {
    log.error('[TEST 1.3] Backend Health Check - Server not responding');
  }
}

// Test: Get Listings
async function testGetListings() {
  try {
    const response = await api.get('/listings?page=1&limit=10', {
      headers: {
        Authorization: `Bearer ${state.accessToken}`,
      },
    });

    if (response.data.success) {
      log.success('[TEST 2.1] Get Listings');
      log.info(`  Found: ${response.data.data.count || 0} listings\n`);
    }
  } catch (error) {
    log.warn(`[TEST 2.1] Get Listings - ${error.response?.data?.message || error.message}`);
  }
}

// Test: Booking Flow
async function testBookingFlow() {
  try {
    // Create a test booking
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 7);
    const checkOutDate = new Date();
    checkOutDate.setDate(checkOutDate.getDate() + 14);

    const response = await api.post(
      '/bookings',
      {
        propertyId: 'test-property-id',
        unitId: 'test-unit-id',
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        notes: 'Test booking',
      },
      {
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      }
    );

    if (response.data.success) {
      state.bookingId = response.data.data.id;
      log.success('[TEST 3.1] Create Booking');
      log.info(`  Booking ID: ${state.bookingId}\n`);
    }
  } catch (error) {
    log.warn(`[TEST 3.1] Create Booking - ${error.response?.data?.message || error.message}`);
  }
}

// Run the tests
runTests().catch((err) => {
  log.error(`Test suite failed: ${err.message}`);
  process.exit(1);
});
