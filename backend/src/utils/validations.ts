/**
 * Validation schemas using Zod
 */

import { z } from 'zod'

export const authSchemas = {
  register: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number').optional(),
    state: z.string().min(2, 'State is required'),
    userType: z.enum(['TENANT', 'LANDLORD']).optional().default('TENANT'),
  }),

  login: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
  }),

  refreshToken: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),

  updateProfile: z.object({
    firstName: z.string().min(2, 'First name is required').optional(),
    lastName: z.string().min(2, 'Last name is required').optional(),
    phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number').optional(),
  }),

  changePassword: z.object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
}

export const listingSchemas = {
  createProperty: z.object({
    name: z.string().min(3, 'Property name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    imageUrls: z.array(z.string().url()).optional(),
    amenities: z.array(z.string()).optional(),
  }),

  updateProperty: z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    address: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    imageUrls: z.array(z.string().url()).optional(),
    amenities: z.array(z.string()).optional(),
  }),

  addUnit: z.object({
    unitNumber: z.string().min(1, 'Unit number is required'),
    bedroomCount: z.number().int().min(1).max(10),
    bathroomCount: z.number().int().min(1).max(10),
    size: z.number().int().min(100, 'Size must be at least 100 sqm'),
    pricePerMonth: z.number().int().min(1000, 'Price must be at least 1000 NGN'),
    imageUrls: z.array(z.string().url()).optional(),
    amenities: z.array(z.string()).optional(),
  }),
}

export const bookingSchemas = {
  createBooking: z.object({
    propertyId: z.string().min(1, 'Property ID is required'),
    unitId: z.string().min(1, 'Unit ID is required'),
    checkInDate: z.string().datetime('Invalid check-in date'),
    checkOutDate: z.string().datetime('Invalid check-out date'),
    notes: z.string().optional(),
  }),

  cancelBooking: z.object({
    reason: z.string().optional(),
  }),

  approveBooking: z.object({
    bookingId: z.string().min(1),
  }),

  rejectBooking: z.object({
    bookingId: z.string().min(1),
    reason: z.string().optional(),
  }),
}

export const reviewSchemas = {
  createReview: z.object({
    bookingId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    title: z.string().min(5),
    comment: z.string().min(10),
    cleanliness: z.number().int().min(1).max(5).optional(),
    accuracy: z.number().int().min(1).max(5).optional(),
    communication: z.number().int().min(1).max(5).optional(),
  }),
}

export const messageSchemas = {
  sendMessage: z.object({
    recipientId: z.string().min(1),
    content: z.string().min(1).max(5000),
  }),
}

export const paymentSchemas = {
  initializePayment: z.object({
    bookingId: z.string().min(1),
    amount: z.number().min(1),
  }),

  verifyPayment: z.object({
    reference: z.string().min(1),
  }),
}
