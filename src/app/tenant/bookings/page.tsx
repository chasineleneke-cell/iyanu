'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/common/Navbar'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/states/EmptyState'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useGetBookings, useCancelBooking } from '@/hooks/useBookings'
import { toastSuccess, toastError } from '@/utils/toast'
import Modal from '@/components/ui/Modal'
import { formatNGN } from '@/utils/nigerian-locale'

export default function TenantBookingsPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'cancelled'>('all')
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const { data: bookingsResponse, isLoading, error } = useGetBookings()
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()

  const bookings = bookingsResponse?.data || []

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status?.toLowerCase() === statusFilter)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning'
      case 'approved':
        return 'success'
      case 'rejected':
        return 'danger'
      case 'cancelled':
        return 'info'
      default:
        return 'default'
    }
  }

  const handleCancelBooking = () => {
    if (!selectedBooking) return

    cancelBooking(selectedBooking, {
      onSuccess: () => {
        toastSuccess('Booking cancelled successfully')
        setShowCancelModal(false)
        setSelectedBooking(null)
      },
      onError: (err: any) => {
        toastError(err.message || 'Failed to cancel booking')
      }
    })
  }

  return (
    <>
      <Navbar isAuthenticated={true} userRole="tenant" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600">Track all your apartment booking requests and status</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected', 'cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : error ? (
          <EmptyState 
            title="Error Loading Bookings" 
            description="Something went wrong. Please try again."
            action={{ label: 'Retry', onClick: () => window.location.reload() }}
          />
        ) : filteredBookings.length === 0 ? (
          <EmptyState 
            title="No Bookings" 
            description={statusFilter === 'all' 
              ? "You haven't made any booking requests yet."
              : `You don't have any ${statusFilter} bookings.`}
            action={{ label: 'Browse Apartments', onClick: () => router.push('/search') }}
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white border rounded-lg p-4 hover:shadow-lg transition">
                <div className="grid md:grid-cols-4 gap-4 items-start mb-4">
                  {/* Listing Info */}
                  <div>
                    <p className="text-sm text-gray-600">Apartment</p>
                    <Link href={`/listing/${booking.unitId}`} className="font-semibold text-blue-600 hover:underline">
                      Unit {booking.unitId.slice(0, 8)}
                    </Link>
                  </div>

                  {/* Dates */}
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">
                      {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="font-semibold text-lg">{formatNGN(booking.totalPrice)}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge variant={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded">
                    <span className="font-semibold">Notes:</span> {booking.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Link href={`/booking/${booking.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  
                  {booking.status?.toLowerCase() === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        setSelectedBooking(booking.id)
                        setShowCancelModal(true)
                      }}
                    >
                      Cancel
                    </Button>
                  )}

                  {booking.status?.toLowerCase() === 'approved' && (
                    <Link href={`/payment/${booking.id}`}>
                      <Button variant="primary" size="sm">
                        Pay Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {!isLoading && bookings.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold">{bookings.filter(b => b.status?.toLowerCase() === 'approved').length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold">{bookings.filter(b => b.status?.toLowerCase() === 'pending').length}</p>
            </div>
          </div>
        )}
      </main>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        title="Cancel Booking"
          description="Are you sure you want to cancel this booking request? This action cannot be undone."
          onClose={() => setShowCancelModal(false)}
        >
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="outline"
              onClick={() => setShowCancelModal(false)}
            >
              Keep Booking
            </Button>
            <Button 
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </div>
        </Modal>
    </>
  )
}
