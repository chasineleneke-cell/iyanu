/**
 * Booking Page
 * Complete booking flow with date selection and payment
 */

'use client'

import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/common/Navbar'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { useGetListing } from '@/hooks/useListings'
import { useCreateBooking } from '@/hooks/useBookings'
import { ListingSkeleton } from '@/components/skeletons/ListingSkeleton'
import { EmptyState } from '@/components/states/EmptyState'
import { toastError, toastSuccess } from '@/utils/toast'
import { formatNGN } from '@/utils/nigerian-locale'
import { useState } from 'react'

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params?.id as string

  const { data: listing, isLoading, error } = useGetListing(listingId)
  const { mutate: createBooking, isPending: isSubmitting } = useCreateBooking()

  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    notes: '',
  })

  const [totalPrice, setTotalPrice] = useState(0)

  // Calculate duration and price
  const calculatePrice = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut || !listing) return 0

    const checkinDate = new Date(checkIn)
    const checkoutDate = new Date(checkOut)

    if (checkoutDate <= checkinDate) return 0

    const days = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24))
    return listing.price * days
  }

  const handleDateChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    setTotalPrice(calculatePrice(newData.checkInDate, newData.checkOutDate))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.checkInDate || !formData.checkOutDate) {
      toastError('Please select both check-in and check-out dates')
      return
    }

    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      toastError('Check-out date must be after check-in date')
      return
    }

    const unitId = listing?.unitId || listingId

    createBooking(
      {
        unitId,
        checkInDate: new Date(formData.checkInDate).toISOString(),
        checkOutDate: new Date(formData.checkOutDate).toISOString(),
        notes: formData.notes,
      },
      {
        onSuccess: () => {
          toastSuccess('Booking request submitted successfully!')
          setTimeout(() => router.push('/tenant/dashboard'), 2000)
        },
        onError: (err) => {
          toastError(err.message || 'Failed to create booking')
        },
      }
    )
  }

  if (isLoading) {
    return (
      <>
        <Navbar isAuthenticated={true} userRole="tenant" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <ListingSkeleton />
        </main>
      </>
    )
  }

  if (error || !listing) {
    return (
      <>
        <Navbar isAuthenticated={true} userRole="tenant" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <EmptyState
            title="Listing Not Found"
            description="The property you're trying to book doesn't exist."
            action={{ label: 'Back to Search', onClick: () => router.push('/search') }}
          />
        </main>
      </>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const minCheckOut = formData.checkInDate
    ? new Date(new Date(formData.checkInDate).getTime() + 86400000).toISOString().split('T')[0]
    : today

  return (
    <>
      <Navbar isAuthenticated={true} userRole="tenant" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/search">Search</Link> / <Link href={`/listing/${listing.id}`}>{listing.title}</Link> / <span>Book</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Property Info */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold mb-2">{listing.title}</h3>
                    <p className="text-sm text-gray-600">{listing.location?.address}</p>
                    <p className="text-sm font-semibold text-blue-600 mt-2">{formatNGN(listing.price)} per month</p>
                  </div>

                  {/* Dates Section */}
                  <div>
                    <h4 className="font-semibold mb-4">Select Dates</h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                        <Input
                          type="date"
                          min={today}
                          value={formData.checkInDate}
                          onChange={(e) => handleDateChange('checkInDate', e.target.value)}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">When you want to move in</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                        <Input
                          type="date"
                          min={minCheckOut}
                          value={formData.checkOutDate}
                          onChange={(e) => handleDateChange('checkOutDate', e.target.value)}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">When you want to move out (minimum 1 day)</p>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  {formData.checkInDate && formData.checkOutDate && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="text-2xl font-bold">
                            {Math.ceil(
                              (new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}
                            <span className="text-sm text-gray-600"> days</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Price</p>
                          <p className="text-2xl font-bold text-green-600">{formatNGN(totalPrice)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any questions or special requests for the landlord?"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <input type="checkbox" id="terms" required className="mt-1" />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree that my booking request will be sent to the landlord for approval. I understand that the landlord may approve, reject, or
                      request modifications to my booking.
                    </label>
                  </div>

                  {/* Submit */}
                  <Button type="submit" fullWidth disabled={isSubmitting} className="text-lg py-3">
                    {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">By booking, you agree to our Terms of Service and Privacy Policy</p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside>
            {/* Pricing Breakdown */}
            <Card className="mb-6 sticky top-24">
              <CardHeader>
                <CardTitle>Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rate</span>
                  <span className="font-semibold">{formatNGN(listing.price)}</span>
                </div>

                {formData.checkInDate && formData.checkOutDate && (
                  <>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">
                        Duration ({' '}
                        {Math.ceil(
                          (new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        days)
                      </span>
                      <span className="font-semibold">
                        {formatNGN(
                          (listing.price / 30) *
                            Math.ceil(
                              (new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between border-t pt-3 font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">{formatNGN(totalPrice)}</span>
                    </div>

                    <p className="text-xs text-gray-500 pt-3 border-t">Exact amount will be confirmed by landlord after approval</p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Unit Details */}
            <Card>
              <CardHeader>
                <CardTitle>Unit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms</span>
                  <span className="font-semibold">{listing.bedrooms}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Bathrooms</span>
                  <span className="font-semibold">{listing.bathrooms}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Size</span>
                  <span className="font-semibold">{listing.size} sqft</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </>
  )
}
