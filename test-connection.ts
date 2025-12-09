/**
 * Frontend-Backend Connection Test
 * Tests all critical API endpoints to ensure proper integration
 */

import axios, { AxiosInstance } from 'axios'

const BACKEND_URL = 'http://localhost:5000'
const API_BASE = `${BACKEND_URL}/api`

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL'
  error?: string
  data?: any
}

const results: TestResult[] = []

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

let authToken = ''

async function test(name: string, fn: () => Promise<any>) {
  try {
    const result = await fn()
    results.push({ name, status: 'PASS', data: result?.data || result })
    console.log(`✅ ${name}`)
  } catch (error: any) {
    results.push({
      name,
      status: 'FAIL',
      error: error?.response?.data?.message || error?.message,
    })
    console.log(`❌ ${name}: ${error?.response?.data?.message || error?.message}`)
  }
}

async function runTests() {
  console.log('🧪 Starting Frontend-Backend Connection Tests\n')

  // 1. Health Check
  await test('Health Check', async () => {
    return axios.get(`${BACKEND_URL}/health`)
  })

  // 2. Register User
  let userId = ''
  await test('User Registration', async () => {
    const response = await api.post('/auth/register', {
      email: `test-${Date.now()}@example.com`,
      password: 'Test@12345',
      firstName: 'Test',
      lastName: 'User',
      phone: '+2348012345678',
      state: 'Lagos',
      userType: 'TENANT',
    })
    if (response.data.success) {
      userId = response.data.data.user.id
      authToken = response.data.data.accessToken
      api.defaults.headers.Authorization = `Bearer ${authToken}`
    }
    return response.data
  })

  // 3. Get Profile
  await test('Get User Profile', async () => {
    const response = await api.get('/auth/me')
    return response.data.data
  })

  // 4. Update Profile
  await test('Update User Profile', async () => {
    const response = await api.put('/auth/profile', {
      firstName: 'Updated',
      phone: '+2348098765432',
    })
    return response.data.data
  })

  // 5. Create Property (as Landlord)
  let propertyId = ''
  await test('Create Property (Listing)', async () => {
    // First register as landlord
    const landlordEmail = `landlord-${Date.now()}@example.com`
    const registerResp = await api.post('/auth/register', {
      email: landlordEmail,
      password: 'Test@12345',
      firstName: 'Landlord',
      lastName: 'User',
      phone: '+2348012345678',
      state: 'Lagos',
      userType: 'LANDLORD',
    })

    if (registerResp.data.success) {
      const landlordToken = registerResp.data.data.accessToken
      const tempApi = axios.create({
        baseURL: API_BASE,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${landlordToken}`,
        },
      })

      const response = await tempApi.post('/admin/properties', {
        name: 'Test Apartment',
        description: 'A beautiful 2-bedroom apartment',
        address: '123 Main Street',
        city: 'Lagos',
        state: 'Lagos',
        imageUrls: ['https://via.placeholder.com/300'],
        amenities: ['WiFi', 'Air Conditioning'],
      })

      propertyId = response.data.data.id
      return response.data.data
    }
  })

  // 6. List Properties
  await test('Get Properties Listing', async () => {
    const response = await api.get('/listings')
    return {
      count: response.data.data.length,
      sample: response.data.data.slice(0, 2),
    }
  })

  // 7. Get Single Property
  if (propertyId) {
    await test('Get Single Property', async () => {
      const response = await api.get(`/listings/${propertyId}`)
      return response.data.data
    })
  }

  // 8. Create Booking
  let bookingId = ''
  if (propertyId) {
    await test('Create Booking', async () => {
      const checkIn = new Date()
      const checkOut = new Date(checkIn.getTime() + 7 * 24 * 60 * 60 * 1000)

      const response = await api.post('/bookings', {
        propertyId: propertyId,
        unitId: propertyId, // Using propertyId as unitId for test
        checkInDate: checkIn.toISOString(),
        checkOutDate: checkOut.toISOString(),
        notes: 'Test booking',
      })

      if (response.data.success) {
        bookingId = response.data.data.id
      }
      return response.data.data
    })
  }

  // 9. Get User Bookings
  await test('Get User Bookings', async () => {
    const response = await api.get('/bookings')
    return {
      count: response.data.data.length,
      sample: response.data.data.slice(0, 2),
    }
  })

  // 10. Login Test
  await test('User Login', async () => {
    const response = await api.post('/auth/login', {
      email: `test-${Date.now() - 1000}@example.com`,
      password: 'Test@12345',
    })
    return {
      user: response.data.data.user,
      hasAccessToken: !!response.data.data.accessToken,
    }
  })

  // 11. Refresh Token Test
  await test('Refresh Token', async () => {
    const response = await api.post('/auth/refresh', {})
    return {
      hasNewAccessToken: !!response.data.data.accessToken,
    }
  })

  // 12. Logout Test
  await test('User Logout', async () => {
    const response = await api.post('/auth/logout', {})
    return response.data
  })

  // Print summary
  console.log('\n📊 Test Summary\n')
  const passed = results.filter((r) => r.status === 'PASS').length
  const failed = results.filter((r) => r.status === 'FAIL').length
  const total = results.length

  console.log(`Total Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`)

  if (failed > 0) {
    console.log('Failed Tests:')
    results.filter((r) => r.status === 'FAIL').forEach((r) => {
      console.log(`  - ${r.name}: ${r.error}`)
    })
  }

  process.exit(failed > 0 ? 1 : 0)
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test suite failed:', error.message)
  process.exit(1)
})
