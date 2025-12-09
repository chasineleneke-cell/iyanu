import { z } from 'zod'
import { validatePhoneNumber } from './nigerian-locale'

/**
 * Authentication Validation Schemas
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional().default(false),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(validatePhoneNumber, 'Please enter a valid Nigerian phone number'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['tenant', 'admin'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
})
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

/**
 * Profile Validation Schemas
 */

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(validatePhoneNumber, 'Please enter a valid Nigerian phone number'),
  address: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Please enter a complete address'),
  state: z.string().min(1, 'State is required'),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

export const bankDetailsSchema = z.object({
  accountName: z
    .string()
    .min(1, 'Account name is required')
    .min(3, 'Account name must be at least 3 characters'),
  accountNumber: z
    .string()
    .min(10, 'Account number must be 10 digits')
    .max(10, 'Account number must be 10 digits')
    .regex(/^\d+$/, 'Account number must contain only numbers'),
  bankCode: z
    .string()
    .min(1, 'Bank is required'),
})

export type BankDetailsFormData = z.infer<typeof bankDetailsSchema>

/**
 * Property Management Validation Schemas
 */

export const addPropertySchema = z.object({
  name: z
    .string()
    .min(1, 'Property name is required')
    .min(3, 'Property name must be at least 3 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  address: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Please enter a complete address'),
  state: z.string().min(1, 'State is required'),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'Please enter a valid city name'),
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
  imageUrls: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'Upload at least one property image')
    .max(10, 'You can upload a maximum of 10 images'),
})

export type AddPropertyFormData = z.infer<typeof addPropertySchema>

export const addUnitSchema = z.object({
  unitNumber: z
    .string()
    .min(1, 'Unit number is required')
    .min(1, 'Unit number must be at least 1 character'),
  bedroomCount: z
    .number()
    .min(1, 'Must have at least 1 bedroom')
    .max(10, 'Must have at most 10 bedrooms'),
  bathroomCount: z
    .number()
    .min(1, 'Must have at least 1 bathroom')
    .max(10, 'Must have at most 10 bathrooms'),
  size: z
    .number()
    .min(100, 'Unit size must be at least 100 sq ft')
    .max(100000, 'Unit size seems too large'),
  pricePerMonth: z
    .number()
    .min(1000, 'Price must be at least ₦1,000')
    .max(100000000, 'Price seems too high'),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'Upload at least one unit image')
    .max(5, 'You can upload a maximum of 5 images per unit'),
})

export type AddUnitFormData = z.infer<typeof addUnitSchema>

/**
 * Booking Validation Schemas
 */

export const createBookingSchema = z.object({
  unitId: z.string().min(1, 'Unit is required'),
  checkInDate: z
    .string()
    .min(1, 'Check-in date is required')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, 'Check-in date must be today or in the future'),
  checkOutDate: z
    .string()
    .min(1, 'Check-out date is required'),
  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
})
  .refine(
    (data) => new Date(data.checkOutDate) > new Date(data.checkInDate),
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOutDate'],
    }
  )

export type CreateBookingFormData = z.infer<typeof createBookingSchema>

export const submitReviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating is required')
    .max(5, 'Rating must be between 1 and 5'),
  comment: z
    .string()
    .min(1, 'Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must not exceed 1000 characters'),
})

export type SubmitReviewFormData = z.infer<typeof submitReviewSchema>

/**
 * Search & Filter Validation Schemas
 */

export const searchFiltersSchema = z.object({
  state: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  sortBy: z.enum(['newest', 'price-low', 'price-high', 'rating']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
})
  .refine(
    (data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
    {
      message: 'Min price must be less than or equal to max price',
      path: ['maxPrice'],
    }
  )

export type SearchFiltersFormData = z.infer<typeof searchFiltersSchema>

/**
 * Message Validation Schema
 */

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .min(1, 'Message must be at least 1 character')
    .max(5000, 'Message must not exceed 5000 characters'),
})

export type SendMessageFormData = z.infer<typeof sendMessageSchema>

/**
 * Payment Validation Schema
 */

export const paymentSchema = z.object({
  bookingId: z.string().min(1, 'Booking is required'),
  paymentMethod: z.enum(['paystack', 'flutterwave'], {
    errorMap: () => ({ message: 'Please select a valid payment method' }),
  }),
  email: z
    .string()
    .email('Please enter a valid email address'),
})

export type PaymentFormData = z.infer<typeof paymentSchema>
