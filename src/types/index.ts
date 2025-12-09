/**
 * Core TypeScript Types for Nigerian Apartment Rental App
 * Defines all data models and API response shapes
 */

// ===== User Types =====
export type UserRole = 'tenant' | 'landlord' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  profileImage?: string
  address: string
  state: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface TenantProfile extends User {
  verificationStatus: 'pending' | 'verified' | 'rejected'
  bookings: Booking[]
}

export interface LandlordProfile extends User {
  bankDetails?: BankDetails
  properties: Property[]
}

export interface BankDetails {
  accountName: string
  accountNumber: string
  bankCode: string
}

// ===== Property Types =====
export interface Property {
  id: string
  landlordId: string
  name: string
  description: string
  address: string
  state: string
  city: string
  imageUrls: string[]
  amenities: Amenity[]
  createdAt: Date
  updatedAt: Date
  units: Unit[]
}

export interface Unit {
  id: string
  propertyId: string
  unitNumber: string
  bedroomCount: number
  bathroomCount: number
  size: number // in sqft
  pricePerMonth: number // in NGN
  images: string[]
  availability: 'available' | 'booked' | 'maintenance'
  createdAt: Date
  updatedAt: Date
}

export interface Amenity {
  id: string
  name: string
  icon?: string
}

export interface Listing {
  id: string
  unitId: string
  title: string
  description: string
  images: string[]
  price: number // NGN per month
  bedrooms: number
  bathrooms: number
  size: number
  amenities: string[]
  location: Location
  landlordContact: LandlordContactInfo
  reviews?: Review[]
  averageRating?: number
  totalReviews?: number
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  address: string
  state: string
  city: string
  latitude?: number
  longitude?: number
}

export interface LandlordContactInfo {
  name: string
  email: string
  phone: string
  profileImage?: string
}

// ===== Booking Types =====
export interface Booking {
  id: string
  tenantId: string
  unitId: string
  checkInDate: Date
  checkOutDate: Date
  totalPrice: number // NGN
  status: 'pending' | 'approved' | 'rejected' | 'checked_in' | 'completed' | 'cancelled'
  notes?: string
  createdAt: Date
  updatedAt: Date
  payment?: Payment
}

export interface BookingRequest {
  unitId: string
  checkInDate: Date
  checkOutDate: Date
  notes?: string
}

// ===== Payment Types =====
export interface Payment {
  id: string
  bookingId: string
  amount: number // NGN
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'paystack' | 'flutterwave' | 'bank_transfer'
  transactionRef: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentInitiation {
  amount: number
  email: string
  metadata: Record<string, any>
}

// ===== Review Types =====
export interface Review {
  id: string
  bookingId: string
  tenantId: string
  unitId: string
  rating: number // 1-5
  comment: string
  createdAt: Date
  updatedAt: Date
}

// ===== Message Types =====
export interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
}

// ===== Search & Filter Types =====
export interface SearchFilters {
  location?: string
  state?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface AuthRefreshResponse {
  accessToken: string
}

// ===== Validation & Form Types =====
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  state: string
  userType: 'tenant' | 'landlord'
}

export interface AddPropertyFormData {
  name: string
  description: string
  address: string
  state: string
  city: string
  amenities: string[]
}

export interface AddUnitFormData {
  unitNumber: string
  bedroomCount: number
  bathroomCount: number
  size: number
  pricePerMonth: number
  images: File[]
}
