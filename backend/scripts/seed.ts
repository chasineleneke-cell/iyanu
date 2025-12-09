import { PrismaClient, UserRole, PropertyStatus, BookingStatus } from '@prisma/client'
import { hashPassword } from '../src/utils/hash'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  console.log('🗑️  Cleaning existing data...')
  await prisma.booking.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.unit.deleteMany({})
  await prisma.property.deleteMany({})
  await prisma.message.deleteMany({})
  await prisma.user.deleteMany({})

  // Create test users
  console.log('👥 Creating test users...')

  const tenantPassword = await hashPassword('tenant123')
  const landlordPassword = await hashPassword('landlord123')
  const adminPassword = await hashPassword('admin123')

  const tenant1 = await prisma.user.create({
    data: {
      email: 'tenant1@rentng.com',
      password: tenantPassword,
      firstName: 'Oluwaseun',
      lastName: 'Adeyemi',
      phone: '+2348012345678',
      role: UserRole.TENANT,
      profileImage: 'https://i.pravatar.cc/150?img=1',
    },
  })

  const tenant2 = await prisma.user.create({
    data: {
      email: 'tenant2@rentng.com',
      password: tenantPassword,
      firstName: 'Chioma',
      lastName: 'Okafor',
      phone: '+2348087654321',
      role: UserRole.TENANT,
      profileImage: 'https://i.pravatar.cc/150?img=2',
    },
  })

  const landlord1 = await prisma.user.create({
    data: {
      email: 'landlord1@rentng.com',
      password: landlordPassword,
      firstName: 'Kunle',
      lastName: 'Johnson',
      phone: '+2349012345678',
      role: UserRole.LANDLORD,
      profileImage: 'https://i.pravatar.cc/150?img=3',
    },
  })

  const landlord2 = await prisma.user.create({
    data: {
      email: 'landlord2@rentng.com',
      password: landlordPassword,
      firstName: 'Amara',
      lastName: 'Eze',
      phone: '+2349087654321',
      role: UserRole.LANDLORD,
      profileImage: 'https://i.pravatar.cc/150?img=4',
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@rentng.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+2348000000000',
      role: UserRole.ADMIN,
      profileImage: 'https://i.pravatar.cc/150?img=5',
    },
  })

  console.log('✅ Users created:', {
    tenant1: tenant1.email,
    tenant2: tenant2.email,
    landlord1: landlord1.email,
    landlord2: landlord2.email,
    admin: admin.email,
  })

  // Create properties
  console.log('🏢 Creating properties...')

  const property1 = await prisma.property.create({
    data: {
      name: 'Luxury Apartment in Ikoyi',
      description: 'Beautiful 3-bedroom apartment with amazing city views. Fully furnished with modern amenities.',
      address: '25 Bourdillon Road',
      city: 'Lagos',
      state: 'Lagos',
      imageUrls: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
      amenities: ['Wi-Fi', 'Air Conditioning', 'Pool', 'Gym', 'Parking', 'Security'],
      status: PropertyStatus.AVAILABLE,
      userId: landlord1.id,
    },
  })

  const property2 = await prisma.property.create({
    data: {
      name: 'Cozy 2BR in Victoria Island',
      description: 'Modern apartment with excellent location. Walking distance to shopping malls and restaurants.',
      address: '42 Lekki Conservation Centre',
      city: 'Lagos',
      state: 'Lagos',
      imageUrls: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      ],
      amenities: ['Wi-Fi', 'Air Conditioning', 'Parking', 'Security', 'Kitchen'],
      status: PropertyStatus.AVAILABLE,
      userId: landlord2.id,
    },
  })

  const property3 = await prisma.property.create({
    data: {
      name: 'Studio Apartment in Yaba',
      description: 'Affordable studio apartment perfect for students and young professionals.',
      address: '18 Abokodi Street',
      city: 'Lagos',
      state: 'Lagos',
      imageUrls: ['https://images.unsplash.com/photo-1516937941344-00b4ee193a94?w=800'],
      amenities: ['Wi-Fi', 'Air Conditioning', 'Security'],
      status: PropertyStatus.AVAILABLE,
      userId: landlord1.id,
    },
  })

  console.log('✅ Properties created:', {
    property1: property1.name,
    property2: property2.name,
    property3: property3.name,
  })

  // Create units
  console.log('🏠 Creating units...')

  const unit1 = await prisma.unit.create({
    data: {
      propertyId: property1.id,
      unitNumber: 'Unit 1A',
      bedroomCount: 3,
      bathroomCount: 2,
      size: 150,
      pricePerMonth: 450000,
      imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      amenities: ['Balcony', 'Kitchen', 'Living Room'],
      status: 'AVAILABLE',
    },
  })

  const unit2 = await prisma.unit.create({
    data: {
      propertyId: property1.id,
      unitNumber: 'Unit 2A',
      bedroomCount: 2,
      bathroomCount: 1,
      size: 120,
      pricePerMonth: 350000,
      imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      amenities: ['Balcony', 'Kitchen'],
      status: 'AVAILABLE',
    },
  })

  const unit3 = await prisma.unit.create({
    data: {
      propertyId: property2.id,
      unitNumber: 'Unit 1B',
      bedroomCount: 2,
      bathroomCount: 1,
      size: 110,
      pricePerMonth: 380000,
      imageUrls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      amenities: ['Kitchen', 'Balcony'],
      status: 'AVAILABLE',
    },
  })

  const unit4 = await prisma.unit.create({
    data: {
      propertyId: property3.id,
      unitNumber: 'Studio A',
      bedroomCount: 1,
      bathroomCount: 1,
      size: 45,
      pricePerMonth: 150000,
      imageUrls: ['https://images.unsplash.com/photo-1516937941344-00b4ee193a94?w=800'],
      amenities: ['Kitchen'],
      status: 'AVAILABLE',
    },
  })

  console.log('✅ Units created:', {
    unit1: unit1.unitNumber,
    unit2: unit2.unitNumber,
    unit3: unit3.unitNumber,
    unit4: unit4.unitNumber,
  })

  // Create bookings
  console.log('📅 Creating bookings...')

  const checkInDate = new Date()
  checkInDate.setDate(checkInDate.getDate() + 7)

  const checkOutDate = new Date(checkInDate)
  checkOutDate.setDate(checkOutDate.getDate() + 30)

  const booking1 = await prisma.booking.create({
    data: {
      userId: tenant1.id,
      unitId: unit1.id,
      checkInDate,
      checkOutDate,
      status: BookingStatus.CONFIRMED,
      notes: 'Looking forward to staying here!',
    },
  })

  const booking2 = await prisma.booking.create({
    data: {
      userId: tenant2.id,
      unitId: unit3.id,
      checkInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      checkOutDate: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000),
      status: BookingStatus.PENDING,
      notes: 'Family moving to Lagos',
    },
  })

  const booking3 = await prisma.booking.create({
    data: {
      userId: tenant1.id,
      unitId: unit4.id,
      checkInDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      checkOutDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: BookingStatus.PENDING,
    },
  })

  console.log('✅ Bookings created:', {
    booking1: booking1.id,
    booking2: booking2.id,
    booking3: booking3.id,
  })

  // Create reviews
  console.log('⭐ Creating reviews...')

  const review1 = await prisma.review.create({
    data: {
      userId: tenant1.id,
      bookingId: booking1.id,
      rating: 5,
      title: 'Excellent property!',
      comment: 'Great location, very clean and comfortable. Landlord is very responsive.',
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
    },
  })

  console.log('✅ Reviews created:', { review1: review1.id })

  // Create messages
  console.log('💬 Creating messages...')

  const message1 = await prisma.message.create({
    data: {
      senderId: tenant1.id,
      recipientId: landlord1.id,
      content: 'Hi! I am interested in your apartment. Can you tell me more?',
      isRead: false,
    },
  })

  const message2 = await prisma.message.create({
    data: {
      senderId: landlord1.id,
      recipientId: tenant1.id,
      content: 'Hello! Yes, the apartment is available. When would you like to view it?',
      isRead: true,
    },
  })

  console.log('✅ Messages created:', { message1: message1.id, message2: message2.id })

  console.log('\n✨ Database seeded successfully!')
  console.log('\n📋 Test Credentials:')
  console.log('Tenant: tenant1@rentng.com / tenant123')
  console.log('Tenant: tenant2@rentng.com / tenant123')
  console.log('Landlord: landlord1@rentng.com / landlord123')
  console.log('Landlord: landlord2@rentng.com / landlord123')
  console.log('Admin: admin@rentng.com / admin123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
