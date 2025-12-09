'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import type { Property, Unit, PaginatedResponse } from '@/types'

interface CreatePropertyPayload {
  name: string
  description: string
  address: string
  state: string
  city: string
  imageUrls: string[]
  amenities: string[]
}

interface AddUnitPayload {
  unitNumber: string
  bedroomCount: number
  bathroomCount: number
  size: number
  pricePerMonth: number
  images: string[]
}

/**
 * Hook for fetching landlord properties
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useGetProperties()
 * ```
 */
export function useGetProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<Property> }>(
        '/listings'
      )
      return response.data.data
    },
  })
}

/**
 * Hook for fetching a single property with units
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useGetProperty(propertyId)
 * ```
 */
export function useGetProperty(propertyId: string) {
  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: Property }>(`/listings/${propertyId}`)
      return response.data.data
    },
    enabled: !!propertyId,
  })
}

/**
 * Hook for creating a new property
 * 
 * @example
 * ```tsx
 * const { mutate: createProperty, isPending } = useCreateProperty()
 * const handleSubmit = (data) => {
 *   createProperty(data, {
 *     onSuccess: () => toast.success('Property created!')
 *   })
 * }
 * ```
 */
export function useCreateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePropertyPayload) => {
      const response = await apiClient.post<{ success: boolean; message: string; data: Property }>('/listings', payload)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

/**
 * Hook for updating a property
 */
export function useUpdateProperty(propertyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Partial<CreatePropertyPayload>) => {
      const response = await apiClient.put<{ success: boolean; message: string; data: Property }>(
        `/listings/${propertyId}`,
        payload
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] })
    },
  })
}

/**
 * Hook for deleting a property
 */
export function useDeleteProperty(propertyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/properties/${propertyId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

/**
 * Hook for adding a unit to a property
 * 
 * @example
 * ```tsx
 * const { mutate: addUnit } = useAddUnit(propertyId)
 * ```
 */
export function useAddUnit(propertyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddUnitPayload) => {
      const response = await apiClient.post<{ success: boolean; message: string; data: Unit }>(
        `/listings/${propertyId}/units`,
        payload
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

/**
 * Hook for updating a unit
 */
export function useUpdateUnit(propertyId: string, unitId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Partial<AddUnitPayload>) => {
      const response = await apiClient.put<{ success: boolean; message: string; data: Unit }>(
        `/listings/${propertyId}/units/${unitId}`,
        payload
      )
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] })
    },
  })
}

/**
 * Hook for deleting a unit
 */
export function useDeleteUnit(propertyId: string, unitId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/properties/${propertyId}/units/${unitId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}
