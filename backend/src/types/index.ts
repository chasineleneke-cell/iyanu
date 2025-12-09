import { UserRoles } from '../utils/constants'
import { Request } from 'express'

// ===== USER TYPES =====
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  profileImage?: string | null
  role: string
  isVerified: boolean
  isActive: boolean
  state: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  state?: string
  role?: string
}

export interface UpdateUserInput {
  firstName?: string
  lastName?: string
  phone?: string
}

// ===== PROPERTY TYPES =====
export interface Property {
  id: string
  landlordId: string
  name: string
  description: string
  address: string
  city: string
  state: string
  imageUrls: string | string[]
  amenities: string | string[]
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface Unit {
  id: string
  propertyId: string
  unitNumber: string
  bedroomCount: number
  bathroomCount: number
  size: number
  pricePerMonth: number
  imageUrls: string | string[]
  amenities: string | string[]
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

// ===== BOOKING TYPES =====
export interface Booking {
  id: string
  tenantId: string
  propertyId: string
  unitId: string
  checkInDate: Date
  checkOutDate: Date
  status: string
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

// ===== MESSAGE & REVIEW TYPES =====
export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: Date
}

export interface Review {
  id: string
  bookingId: string
  unitId: string
  tenantId: string
  rating: number
  title: string
  comment: string
  cleanliness?: number
  accuracy?: number
  communication?: number
  createdAt: Date
}

// ===== JWT & AUTH TYPES =====
export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export interface AuthUser {
  userId: string
  email: string
  role: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export interface PaginationQuery {
  page?: number
  limit?: number
  skip?: number
}

export interface SearchListingsQuery extends PaginationQuery {
  state?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  amenities?: string[]
  sort?: 'newest' | 'price_asc' | 'price_desc'
}

export interface CreatePropertyPayload {
  name: string
  description: string
  address: string
  city: string
  state: string
  imageUrls: string[]
  amenities: string[]
}

export interface CreateBookingPayload {
  propertyId: string
  unitId: string
  checkInDate: string
  checkOutDate: string
  notes?: string
}

export interface CreateReviewPayload {
  bookingId: string
  unitId: string
  rating: number
  title: string
  comment: string
  cleanliness?: number
  accuracy?: number
  communication?: number
}

export interface SendMessagePayload {
  recipientId: string
  content: string
}

export interface InitializePaymentPayload {
  bookingId: string
  amount: number
  email: string
  reference: string
}
