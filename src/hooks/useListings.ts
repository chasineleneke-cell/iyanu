'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import type { Listing, Review, PaginatedResponse, SearchFilters } from '@/types'

/**
 * Hook for searching listings with filters
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useSearchListings({
 *   state: 'Lagos',
 *   minPrice: 100000,
 *   maxPrice: 500000,
 *   bedrooms: 2,
 *   page: 1,
 *   limit: 12,
 * })
 * ```
 */
export function useSearchListings(filters?: SearchFilters & { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<Listing> }>(
        '/listings/search',
        { params: filters }
      )
      return response.data.data
    },
    enabled: true, // Always fetch to support default empty filters
  })
}

/**
 * Hook for fetching a single listing detail
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useGetListing(listingId)
 * ```
 */
export function useGetListing(listingId: string) {
  return useQuery({
    queryKey: ['listing', listingId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: Listing }>(`/listings/${listingId}`)
      return response.data.data
    },
    enabled: !!listingId,
  })
}

/**
 * Hook for fetching reviews for a listing/unit
 * 
 * @example
 * ```tsx
 * const { data: reviews } = useGetListingReviews(unitId, { page: 1, limit: 5 })
 * ```
 */
export function useGetListingReviews(
  unitId: string,
  options: { page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ['listing-reviews', unitId, options],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<Review> }>(
        `/listings/${unitId}/reviews`,
        { params: options }
      )
      return response.data.data
    },
    enabled: !!unitId,
  })
}

/**
 * Hook for searching listings with advanced filters and sorting
 */
export function useAdvancedSearch(filters: {
  query?: string
  state?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'rating'
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: ['advanced-search', filters],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<Listing> }>(
        '/listings/search/advanced',
        { params: filters }
      )
      return response.data.data
    },
  })
}
