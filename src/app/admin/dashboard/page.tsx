/**
 * Admin/Landlord Dashboard
 * Manages properties, bookings, and revenue with React Query
 */

'use client'

import { useState } from 'react'
import Navbar from '@/components/common/Navbar'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import Modal from '@/components/ui/Modal'
import { useGetProperties } from '@/hooks/useProperties'
import { useGetBookingRequests, useApproveBooking, useRejectBooking } from '@/hooks/useBookings'
import { formatNGN } from '@/utils/nigerian-locale'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/states/EmptyState'
import { toastError, toastSuccess } from '@/utils/toast'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('bookings')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data: propertiesResponse, isLoading: propertiesLoading, error: propertiesError, refetch: refetchProperties } = useGetProperties()
  const { data: requestsResponse, isLoading: requestsLoading, error: requestsError, refetch: refetchRequests } = useGetBookingRequests()
  const { mutate: approveBooking, isPending: isApproving } = useApproveBooking()
  const { mutate: rejectBooking, isPending: isRejecting } = useRejectBooking()

  // Handle PaginatedResponse structure
  const properties = propertiesResponse?.data || []
  const requests = requestsResponse?.data || []

  if (propertiesError) {
    toastError(propertiesError.message || 'Failed to load properties')
  }
  if (requestsError) {
    toastError(requestsError.message || 'Failed to load booking requests')
  }

  // Calculate stats
  const totalProperties = properties.length || 0
  const totalUnits = properties.reduce((sum: number, p) => sum + (p.units?.length || 0), 0) || 0
  const pendingRequests = requests.length || 0  // All returned requests are pending
  const monthlyRevenue = 0 // Would need to aggregate from booking payments

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'pending' => {
    switch (status) {
      case 'approved':
      case 'confirmed':
        return 'success'
      case 'pending':
        return 'pending'
      case 'rejected':
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
  }

  const handleApproveRequest = (requestId: string) => {
    approveBooking(requestId, {
      onSuccess: () => {
        toastSuccess('Booking approved')
        refetchRequests()
      },
      onError: (err: any) => {
        toastError(err.message || 'Failed to approve booking')
      }
    })
  }

  const handleRejectClick = (requestId: string) => {
    setSelectedRequestId(requestId)
    setShowRejectModal(true)
  }

  const handleConfirmReject = () => {
    if (!selectedRequestId) return

    rejectBooking({ bookingId: selectedRequestId, reason: rejectReason }, {
      onSuccess: () => {
        toastSuccess('Booking rejected')
        setShowRejectModal(false)
        setSelectedRequestId(null)
        setRejectReason('')
        refetchRequests()
      },
      onError: (err: any) => {
        toastError(err.message || 'Failed to reject booking')
      }
    })
  }

  const statCards = [
    { label: 'Total Properties', value: totalProperties },
    { label: 'Total Units', value: totalUnits },
    { label: 'Pending Requests', value: pendingRequests },
    { label: 'Monthly Revenue', value: formatNGN(monthlyRevenue) }
  ]

  return (
    <>
      <Navbar isAuthenticated={true} userRole="admin" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link href="/admin/properties/new" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            + Add Property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {propertiesLoading || requestsLoading
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
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'bookings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Booking Requests ({pendingRequests})
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'properties' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Properties ({totalProperties})
              </button>
            </div>

            {/* Booking Requests Tab */}
            {activeTab === 'bookings' && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Recent Booking Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {requestsLoading ? (
                    <div className="space-y-3">
                      {Array(3)
                        .fill(null)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                  ) : !requests || requests.length === 0 ? (
                    <EmptyState 
                      title="No Booking Requests" 
                      description="You don't have any booking requests at this time."
                    />
                  ) : (
                    <div className="space-y-3">
                      {requests.slice(0, 5).map((request: any) => (
                        <div key={request.id || request.bookingId} className="p-3 border rounded hover:bg-gray-50 transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Unit {request.unitId.slice(0, 8)}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(request.checkInDate).toLocaleDateString()} - {new Date(request.checkOutDate).toLocaleDateString()}
                              </p>
                              {request.notes && <p className="text-sm text-gray-500 mt-1">{request.notes}</p>}
                            </div>
                            <div className="space-x-2">
                              <button
                                onClick={() => handleApproveRequest(request.id || request.bookingId)}
                                disabled={isApproving}
                                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                              >
                                {isApproving ? 'Approving...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleRejectClick(request.id || request.bookingId)}
                                disabled={isRejecting}
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                              >
                                {isRejecting ? 'Rejecting...' : 'Reject'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
                    <div className="space-y-3">
                      {Array(3)
                        .fill(null)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                  ) : !properties || properties.length === 0 ? (
                    <EmptyState 
                      title="No Properties Yet" 
                      description="Start by adding your first property to begin accepting bookings."
                      action={{ label: 'Add Property', onClick: () => window.location.href = '/admin/properties/new' }}
                    />
                  ) : (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <div key={property.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                          <div>
                            <h4 className="font-semibold">{property.name}</h4>
                            <p className="text-sm text-gray-600">{property.units?.length || 0} units • Nigeria</p>
                            <p className="text-xs text-gray-500 mt-1">Created: {new Date(property.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/properties/${property.id}`}
                              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-semibold"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/admin/properties/${property.id}/units`}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-semibold"
                            >
                              Units
                            </Link>
                            <Link
                              href={`/admin/properties/${property.id}/bookings`}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-semibold"
                            >
                              Bookings
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {/* Profile */}
            <Card className="mb-6">
              <CardContent>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h3 className="font-semibold">Landlord</h3>
                  <p className="text-sm text-gray-600">landlord@email.com</p>
                  <p className="text-xs text-green-600 mt-2">✓ Verified Account</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/properties/new" className="block px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 text-sm font-semibold">
                  Add Property
                </Link>
                <Link
                  href="/admin/bookings"
                  className="block px-4 py-2 border border-blue-600 text-blue-600 text-center rounded-lg hover:bg-blue-50 text-sm"
                >
                  All Bookings
                </Link>
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 text-sm"
                >
                  Edit Profile
                </Link>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-green-600">98% avg</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Occupancy Rate</span>
                  <span className="font-semibold">92%</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Tenant Rating</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <Modal
          isOpen={showRejectModal}
          title="Reject Booking Request?"
          description="Provide a reason for rejecting this booking request."
          onClose={() => {
            setShowRejectModal(false)
            setSelectedRequestId(null)
            setRejectReason('')
          }}
        >
          <div className="space-y-4 py-4">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="outline"
              onClick={() => {
                setShowRejectModal(false)
                setSelectedRequestId(null)
                setRejectReason('')
              }}
            >
              Keep
            </Button>
            <Button 
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmReject}
              disabled={isRejecting}
            >
              {isRejecting ? 'Rejecting...' : 'Reject'}
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
