'use client'

import { useState } from 'react'
import Navbar from '@/components/common/Navbar'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import Modal from '@/components/ui/Modal'
import { useGetBookings, useCancelBooking } from '@/hooks/useBookings'
import { formatNGN } from '@/utils/nigerian-locale'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/states/EmptyState'
import { toastError, toastSuccess } from '@/utils/toast'

export default function TenantDashboardPage() {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  
  const { data: bookingResponse, isLoading, error, refetch } = useGetBookings()
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
  
  // Handle PaginatedResponse structure
  const bookings = bookingResponse?.data || []

  // Calculate stats
  const activeBookings = bookings.filter((b) => b.status === 'checked_in').length || 0
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length || 0
  const totalSpent = bookings.reduce((sum, b) => {
    return sum + b.totalPrice
  }, 0) || 0

  if (error) {
    toastError(error.message || 'Failed to load bookings')
  }

  const statCards = [
    { label: 'Active Bookings', value: activeBookings },
    { label: 'Pending Approvals', value: pendingBookings },
    { label: 'Total Bookings', value: bookings.length || 0 },
    { label: 'Total Spent', value: formatNGN(totalSpent) }
  ]

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'pending' => {
    switch (status) {
      case 'active':
      case 'confirmed':
        return 'success'
      case 'pending':
      case 'waiting_approval':
        return 'pending'
      case 'completed':
        return 'default'
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
  }

  const handleCancelClick = (bookingId: string) => {
    setSelectedBookingId(bookingId)
    setShowCancelModal(true)
  }

  const handleConfirmCancel = () => {
    if (!selectedBookingId) return

    cancelBooking(selectedBookingId, {
      onSuccess: () => {
        toastSuccess('Booking cancelled successfully')
        setShowCancelModal(false)
        setSelectedBookingId(null)
        refetch()
      },
      onError: (err: any) => {
        toastError(err.message || 'Failed to cancel booking')
      }
    })
  }

  return (
    <>
      <Navbar isAuthenticated={true} userRole="tenant" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tenant Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? Array(4)
                .fill(null)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent>
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-8 w-12" />
                    </CardContent>
                  </Card>
                ))
            : statCards.map((stat, i) => (
                <Card key={i}>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Bookings */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                  </div>
                ) : !bookings || bookings.length === 0 ? (
                  <EmptyState 
                    title="No Bookings Yet" 
                    description="You haven't made any bookings. Start exploring apartments!"
                    action={{ label: 'Browse Apartments', onClick: () => window.location.href = '/search' }}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left py-2">Apartment</th>
                          <th className="text-left py-2">Duration</th>
                          <th className="text-left py-2">Price</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => {
                          const checkin = new Date(booking.checkInDate)
                          const checkout = new Date(booking.checkOutDate)
                          const duration = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))

                          return (
                            <tr key={booking.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 font-semibold">Unit {booking.unitId.slice(0, 8)}</td>
                              <td className="py-3 text-xs">{duration} days</td>
                              <td className="py-3">{formatNGN(booking.totalPrice)}</td>
                              <td className="py-3">
                                <Badge variant={getStatusColor(booking.status)}>{getStatusLabel(booking.status)}</Badge>
                              </td>
                              <td className="py-3 space-x-2">
                                <Link href={`/booking/${booking.id}`} className="text-blue-600 hover:underline text-xs">
                                  View
                                </Link>
                                {booking.status === 'pending' && (
                                  <button onClick={() => handleCancelClick(booking.id)} className="text-red-600 hover:underline text-xs">
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings && bookings.length > 0 ? (
                      bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="p-3 border rounded hover:bg-gray-50">
                          <div className="flex justify-between">
                            <span className="font-semibold text-sm">Booking #{booking.id.slice(0, 8)}</span>
                            <span className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-600">Status: {getStatusLabel(booking.status)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm">No recent activity</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside>
            {/* Profile */}
            <Card className="mb-6">
              <CardContent>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="font-semibold">User</h3>
                  <p className="text-sm text-gray-600">user@email.com</p>
                  <p className="text-xs text-green-600 mt-2">✓ Verified Account</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/search" className="block px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 text-sm font-semibold">
                  Browse Apartments
                </Link>
                <Link href="/tenant/profile" className="block px-4 py-2 border border-blue-600 text-blue-600 text-center rounded-lg hover:bg-blue-50 text-sm">
                  Edit Profile
                </Link>
                <Button variant="outline" fullWidth>
                  Support
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">2024</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">{bookings?.length || 0}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold">{bookings?.filter((b) => b.status === 'completed').length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <Modal
          isOpen={showCancelModal}
          title="Cancel Booking?"
          description="Are you sure you want to cancel this booking request? This action cannot be undone."
          onClose={() => {
            setShowCancelModal(false)
            setSelectedBookingId(null)
          }}
        >
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="outline"
              onClick={() => {
                setShowCancelModal(false)
                setSelectedBookingId(null)
              }}
            >
              Keep Booking
            </Button>
            <Button 
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
