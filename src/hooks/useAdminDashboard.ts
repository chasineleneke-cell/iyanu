'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'

export interface AdminDashboardStats {
  totalProperties: number
  totalBookings: number
  totalRevenue: number
  occupancyRate: number
  pendingRequests: number
  activeListings: number
  averageRating: number
  monthlyRevenue: number
  recentBookings: Array<{
    id: string
    tenantName: string
    propertyName: string
    amount: number
    status: string
    date: string
  }>
  propertyPerformance: Array<{
    propertyId: string
    name: string
    occupancy: number
    revenue: number
    bookings: number
  }>
}

/**
 * Hook for fetching admin dashboard statistics
 * 
 * Provides key performance indicators (KPIs) for landlord/admin dashboard.
 * Includes metrics like total properties, bookings, revenue, and occupancy rate.
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useAdminDashboard()
 * 
 * return (
 *   <>
 *     <KPICard title="Total Properties" value={data?.totalProperties} />
 *     <RevenueChart data={data?.recentBookings} />
 *   </>
 * )
 * ```
 */
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: AdminDashboardStats }>(
        '/admin/dashboard'
      )
      return response.data.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for fetching dashboard statistics with date range filter
 * 
 * @example
 * ```tsx
 * const { data } = useDashboardStats({
 *   startDate: '2025-01-01',
 *   endDate: '2025-12-31',
 * })
 * ```
 */
export function useDashboardStats(options: {
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['admin-dashboard-stats', options],
    queryFn: async () => {
      const response = await apiClient.get<AdminDashboardStats>(
        '/admin/dashboard/stats',
        { params: options }
      )
      return response.data
    },
  })
}

/**
 * Hook for fetching revenue chart data
 * 
 * Returns monthly or daily revenue data for charting
 */
export function useRevenueChartData(options: { period?: 'daily' | 'monthly' } = {}) {
  return useQuery({
    queryKey: ['revenue-chart', options],
    queryFn: async () => {
      const response = await apiClient.get<
        Array<{ date: string; revenue: number; bookings: number }>
      >('/admin/dashboard/revenue', { params: options })
      return response.data
    },
  })
}

/**
 * Hook for fetching occupancy trends data
 * 
 * Returns occupancy rates over time for charting
 */
export function useOccupancyTrendData() {
  return useQuery({
    queryKey: ['occupancy-trend'],
    queryFn: async () => {
      const response = await apiClient.get<
        Array<{
          date: string
          occupancy: number
          propertyId: string
          propertyName: string
        }>
      >('/admin/dashboard/occupancy')
      return response.data
    },
  })
}

/**
 * Hook for fetching top performing properties
 */
export function useTopProperties() {
  return useQuery({
    queryKey: ['top-properties'],
    queryFn: async () => {
      const response = await apiClient.get<
        Array<{
          id: string
          name: string
          occupancy: number
          revenue: number
          rating: number
        }>
      >('/admin/dashboard/top-properties')
      return response.data
    },
  })
}
