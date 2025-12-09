'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import type { Booking, BookingRequest, Review, PaginatedResponse } from '@/types'

interface CreateBookingPayload {
  unitId: string
  checkInDate: string // ISO date
  checkOutDate: string // ISO date
  notes?: string
}

interface SubmitReviewPayload {
  rating: number
  comment: string
}

/**
 * Hook for creating a booking request
 * 
 * @example
 * ```tsx
 * const { mutate: createBooking, isPending } = useCreateBooking()
 * const handleSubmit = (data) => {
 *   createBooking(data, {
 *     onSuccess: () => router.push('/tenant/bookings')
 *   })
 * }
 * ```
 */
export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const response = await apiClient.post<{ success: boolean; message: string; data: Booking }>('/bookings', payload)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

/**
 * Hook for fetching tenant bookings
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useGetBookings({ page: 1, limit: 10 })
 * ```
 */
export function useGetBookings(options: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ['bookings', options],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<Booking> }>(
        '/bookings',
        { params: options }
      )
      return response.data.data
    },
  })
}

/**
 * Hook for fetching a single booking
 */
export function useGetBooking(bookingId: string) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: Booking }>(`/bookings/${bookingId}`)
      return response.data.data
    },
    enabled: !!bookingId,
  })
}

/**
 * Hook for cancelling a booking
 * 
 * @example
 * ```tsx
 * const { mutate: cancelBooking } = useCancelBooking()
 * ```
 */
export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookingId: string) => {
      await apiClient.post(`/bookings/${bookingId}/cancel`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

/**
 * Hook for submitting a booking review
 */
export function useSubmitReview(bookingId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SubmitReviewPayload) => {
      const response = await apiClient.post<{ success: boolean; message: string; data: Review }>(
        `/bookings/${bookingId}/review`,
        payload
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

/**
 * Hook for fetching booking requests for landlord
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useGetBookingRequests({ page: 1, limit: 10 })
 * ```
 */
export function useGetBookingRequests(
  options: { page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ['booking-requests', options],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<BookingRequest> }>(
        '/bookings/requests',
        { params: options }
      )
      return response.data.data
    },
  })
}

/**
 * Hook for approving a booking request
 * 
 * @example
 * ```tsx
 * const { mutate: approveBooking } = useApproveBooking()
 * ```
 */
export function useApproveBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await apiClient.post<{ success: boolean; message: string; data: Booking }>(
        `/bookings/${bookingId}/approve`
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

/**
 * Hook for rejecting a booking request
 * 
 * @example
 * ```tsx
 * const { mutate: rejectBooking } = useRejectBooking()
 * const handleReject = (bookingId) => {
 *   rejectBooking(bookingId, {
 *     onSuccess: () => toast.success('Booking rejected')
 *   })
 * }
 * ```
 */
export function useRejectBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: { bookingId: string; reason?: string }
    ) => {
      await apiClient.post(`/bookings/${payload.bookingId}/reject`, {
        reason: payload.reason,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] })
    },
  })
}

/**
 * Hook for fetching reviews for a unit/property
 */
export function useGetUnitReviews(unitId: string) {
  return useQuery({
    queryKey: ['reviews', unitId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: Review[] }>(
        `/units/${unitId}/reviews`
      )
      return response.data.data
    },
    enabled: !!unitId,
  })
}
