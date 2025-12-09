/**
 * Comprehensive End-to-End Testing Script
 * Tests all user flows: Tenant, Landlord, Admin
 */

import axios, { AxiosInstance } from 'axios'

const API_BASE = 'http://localhost:5000/api'

interface E2ETestResult {
  flow: string
  testName: string
  status: 'PASS' | 'FAIL'
  error?: string
  response?: any
}

const results: E2ETestResult[] = []

class E2ETester {
  private api: AxiosInstance
  private tenantToken: string = ''
  private landlordToken: string = ''
  private adminToken: string = ''
  private testPropertyId: string = ''
  private testBookingId: string = ''
  private testUnitId: string = ''

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
  }

  async test(flow: string, testName: string, fn: () => Promise<any>) {
    try {
      const response = await fn()
      results.push({
        flow,
        testName,
        status: 'PASS',
        response: response?.data || response,
      })
      console.log(`  ✅ ${testName}`)
      return response?.data || response
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message
      results.push({
        flow,
        testName,
        status: 'FAIL',
        error: errorMsg,
      })
      console.log(`  ❌ ${testName}: ${errorMsg}`)
      return null
    }
  }

  async runTenantFlow() {
    console.log('\n👤 TENANT FLOW\n')

    // 1. Register Tenant
    const registerResp = await this.test(
      'Tenant',
      'Register as Tenant',
      async () => {
        return this.api.post('/auth/register', {
          email: `tenant-${Date.now()}@example.com`,
          password: 'TenantPass@123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+2348012345678',
          state: 'Lagos',
          userType: 'TENANT',
        })
      }
    )

    if (registerResp?.data?.accessToken) {
      this.tenantToken = registerResp.data.accessToken
      this.api.defaults.headers['Authorization'] = `Bearer ${this.tenantToken}`
    }

    // 2. Get Profile
    await this.test('Tenant', 'Get Profile', async () => {
      return this.api.get('/auth/me')
    })

    // 3. Update Profile
    await this.test('Tenant', 'Update Profile', async () => {
      return this.api.put('/auth/profile', {
        firstName: 'Jonathan',
        phone: '+2348098765432',
      })
    })

    // 4. Search Listings
    const listingsResp = await this.test(
      'Tenant',
      'Search & List Properties',
      async () => {
        return this.api.get('/listings')
      }
    )

    if (listingsResp?.data?.length > 0) {
      this.testPropertyId = listingsResp.data[0].id
      this.testUnitId = listingsResp.data[0].id // Using property as unit for testing

      // 5. View Listing Details
      await this.test('Tenant', 'View Property Details', async () => {
        return this.api.get(`/listings/${this.testPropertyId}`)
      })

      // 6. Create Booking
      const checkIn = new Date()
      const checkOut = new Date(checkIn.getTime() + 7 * 24 * 60 * 60 * 1000)

      const bookingResp = await this.test(
        'Tenant',
        'Create Booking',
        async () => {
          return this.api.post('/bookings', {
            propertyId: this.testPropertyId,
            unitId: this.testUnitId,
            checkInDate: checkIn.toISOString(),
            checkOutDate: checkOut.toISOString(),
            notes: 'Test booking request',
          })
        }
      )

      if (bookingResp?.data?.id) {
        this.testBookingId = bookingResp.data.id

        // 7. Get User Bookings
        await this.test('Tenant', 'View My Bookings', async () => {
          return this.api.get('/bookings?page=1&limit=10')
        })

        // 8. View Single Booking
        await this.test('Tenant', 'View Booking Details', async () => {
          return this.api.get(`/bookings/${this.testBookingId}`)
        })
      }
    }

    // 9. Change Password
    await this.test('Tenant', 'Change Password', async () => {
      return this.api.post('/auth/change-password', {
        oldPassword: 'TenantPass@123',
        newPassword: 'NewTenantPass@456',
      })
    })

    // 10. Logout
    await this.test('Tenant', 'Logout', async () => {
      return this.api.post('/auth/logout', {})
    })
  }

  async runLandlordFlow() {
    console.log('\n🏠 LANDLORD FLOW\n')

    // 1. Register Landlord
    const registerResp = await this.test(
      'Landlord',
      'Register as Landlord',
      async () => {
        return this.api.post('/auth/register', {
          email: `landlord-${Date.now()}@example.com`,
          password: 'LandlordPass@123',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+2348087654321',
          state: 'Abuja',
          userType: 'LANDLORD',
        })
      }
    )

    if (registerResp?.data?.accessToken) {
      this.landlordToken = registerResp.data.accessToken
      this.api.defaults.headers['Authorization'] = `Bearer ${this.landlordToken}`
    }

    // 2. Get Profile
    await this.test('Landlord', 'Get Profile', async () => {
      return this.api.get('/auth/me')
    })

    // 3. Add Property
    const propertyResp = await this.test(
      'Landlord',
      'Add New Property',
      async () => {
        return this.api.post('/admin/properties', {
          name: 'Modern 2BR Apartment',
          description: 'Beautiful modern apartment in prime location',
          address: '456 Park Avenue',
          city: 'Abuja',
          state: 'Abuja',
          imageUrls: ['https://via.placeholder.com/400'],
          amenities: ['WiFi', 'Pool', 'Gym', 'Security'],
        })
      }
    )

    if (propertyResp?.data?.id) {
      const propertyId = propertyResp.data.id

      // 4. Update Property
      await this.test('Landlord', 'Update Property', async () => {
        return this.api.put(`/admin/properties/${propertyId}`, {
          name: 'Modern 2BR Apartment - Updated',
          description: 'Updated description',
        })
      })

      // 5. Get Property Details
      await this.test('Landlord', 'View Property Details', async () => {
        return this.api.get(`/admin/properties/${propertyId}`)
      })

      // 6. Get Landlord Bookings
      await this.test('Landlord', 'View Property Bookings', async () => {
        return this.api.get('/bookings/landlord/all?page=1&limit=10')
      })
    }

    // 7. Logout
    await this.test('Landlord', 'Logout', async () => {
      return this.api.post('/auth/logout', {})
    })
  }

  async runAdminFlow() {
    console.log('\n👨‍💼 ADMIN FLOW\n')

    // 1. Register Admin (simulated)
    const registerResp = await this.test(
      'Admin',
      'Admin Login',
      async () => {
        // In production, admin would be created during deployment
        // For now, we'll use the tenant token as a fallback
        return this.api.post('/auth/login', {
          email: `admin-${Date.now()}@example.com`,
          password: 'AdminPass@123',
        })
      }
    )

    if (registerResp?.data?.accessToken) {
      this.adminToken = registerResp.data.accessToken
      this.api.defaults.headers['Authorization'] = `Bearer ${this.adminToken}`
    } else {
      console.log('  ℹ️  Admin flow skipped (admin user not pre-created)')
      return
    }

    // 2. Get Dashboard Analytics (if implemented)
    await this.test('Admin', 'Get Dashboard Analytics', async () => {
      return this.api.get('/admin/dashboard')
    })

    // 3. Get All Bookings (if implemented)
    await this.test('Admin', 'View All Bookings', async () => {
      return this.api.get('/admin/bookings')
    })
  }

  async runAuthFlow() {
    console.log('\n🔐 AUTHENTICATION FLOW\n')

    // Register
    const registerResp = await this.test(
      'Auth',
      'Register User',
      async () => {
        return this.api.post('/auth/register', {
          email: `auth-test-${Date.now()}@example.com`,
          password: 'AuthTest@123',
          firstName: 'Auth',
          lastName: 'Tester',
          phone: '+2348011111111',
          state: 'Lagos',
          userType: 'TENANT',
        })
      }
    )

    if (registerResp?.data) {
      const { email, password } = {
        email: registerResp.response.config.data
          ? JSON.parse(registerResp.response.config.data).email
          : '',
        password: 'AuthTest@123',
      }

      // Login
      const loginResp = await this.test('Auth', 'Login User', async () => {
        return this.api.post('/auth/login', {
          email: `auth-test-${Date.now() - 1000}@example.com`,
          password: 'AuthTest@123',
        })
      })

      if (loginResp?.data?.accessToken) {
        const token = loginResp.data.accessToken
        this.api.defaults.headers['Authorization'] = `Bearer ${token}`

        // Refresh Token
        await this.test('Auth', 'Refresh Token', async () => {
          return this.api.post('/auth/refresh', {})
        })
      }
    }
  }

  printSummary() {
    console.log('\n\n📊 END-TO-END TEST SUMMARY\n')

    const passed = results.filter((r) => r.status === 'PASS').length
    const failed = results.filter((r) => r.status === 'FAIL').length
    const total = results.length

    console.log(`Total Tests: ${total}`)
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`)

    // Group by flow
    const flows = [...new Set(results.map((r) => r.flow))]
    flows.forEach((flow) => {
      const flowResults = results.filter((r) => r.flow === flow)
      const flowPassed = flowResults.filter((r) => r.status === 'PASS').length
      console.log(`  ${flow}: ${flowPassed}/${flowResults.length}`)
    })

    if (failed > 0) {
      console.log('\n❌ Failed Tests:')
      results
        .filter((r) => r.status === 'FAIL')
        .forEach((r) => {
          console.log(`  [${r.flow}] ${r.testName}: ${r.error}`)
        })
    }

    process.exit(failed > 0 ? 1 : 0)
  }
}

async function runE2ETests() {
  const tester = new E2ETester()

  try {
    await tester.runAuthFlow()
    await tester.runTenantFlow()
    await tester.runLandlordFlow()
    await tester.runAdminFlow()
    tester.printSummary()
  } catch (error) {
    console.error('❌ E2E Test Suite Failed:', error)
    process.exit(1)
  }
}

runE2ETests()
