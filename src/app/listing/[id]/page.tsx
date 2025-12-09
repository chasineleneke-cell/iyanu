/**
 * Listing Detail Page
 * Shows full details of a property with booking option and React Query data fetching
 */

'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/common/Navbar'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { formatNGN } from '@/utils/nigerian-locale'
import { useGetListing } from '@/hooks/useListings'
import { ListingSkeleton } from '@/components/skeletons/ListingSkeleton'
import { EmptyState } from '@/components/states/EmptyState'
import { toastError } from '@/utils/toast'
import { useState } from 'react'

export default function ListingDetailPage() {
  const params = useParams()
  const listingId = params?.id as string
  const [selectedImage, setSelectedImage] = useState<number>(0)

  const { data: listing, isLoading, error, refetch } = useGetListing(listingId)

  if (isLoading) {
    return (
      <>
        <Navbar isAuthenticated={false} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <ListingSkeleton />
        </main>
      </>
    )
  }

  if (error) {
    toastError(error.message || 'Failed to load listing')
    return (
      <>
        <Navbar isAuthenticated={false} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <EmptyState 
            title="Listing Not Found" 
            description="The listing you're looking for doesn't exist."
            action={{ label: 'Try Again', onClick: () => refetch() }}
          />
        </main>
      </>
    )
  }

  if (!listing) {
    return (
      <>
        <Navbar isAuthenticated={false} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <EmptyState 
            title="Listing Not Found" 
            description="The listing you're looking for doesn't exist."
            action={{ label: 'Back to Search', onClick: () => window.location.href = '/search' }}
          />
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar isAuthenticated={false} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/">Home</Link> / <Link href="/search">Search</Link> / <span>{listing.title}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Gallery */}
            <div className="mb-6">
              {/* Main Image */}
              <div className="relative bg-gray-300 h-96 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <Image src={listing.images[selectedImage]} alt={listing.title} width={800} height={400} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">No images available</span>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {listing.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-full h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-blue-600' : 'border-gray-300'
                      }`}
                    >
                      <Image src={image} alt={`${listing.title} ${idx + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <p className="text-gray-600 mb-4">📍 {listing.location.address}, {listing.location.state}</p>
                  {listing.averageRating && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array(5)
                          .fill(null)
                          .map((_, i) => (
                            <span key={i} className={i < Math.floor(listing.averageRating || 0) ? 'text-yellow-500' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                      </div>
                      <span className="font-semibold">{listing.averageRating.toFixed(1)}</span>
                      <span className="text-gray-600">({listing.totalReviews} reviews)</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{listing.description || 'No description provided'}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Amenities</h4>
                    <ul className="space-y-2 text-sm">
                      {listing.amenities && listing.amenities.length > 0 ? (
                        listing.amenities.map((amenity) => (
                          <li key={amenity}>✓ {amenity}</li>
                        ))
                      ) : (
                        <li>No amenities listed</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Specifications</h4>
                    <ul className="space-y-2 text-sm">
                      <li>Bedrooms: {listing.bedrooms}</li>
                      <li>Bathrooms: {listing.bathrooms}</li>
                      <li>Size: {listing.size} sqft</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {listing.reviews && listing.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listing.reviews.map((review, idx) => (
                      <div key={idx} className="pb-4 border-b last:border-b-0">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">Tenant {idx + 1}</span>
                          <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {Array(review.rating)
                            .fill(null)
                            .map((_, i) => (
                              <span key={i} className="text-yellow-500">
                                ★
                              </span>
                            ))}
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Price & Booking */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Price per month</p>
                  <p className="text-4xl font-bold text-green-600">{formatNGN(listing.price)}</p>
                </div>

                <Link href={`/booking/${listing.id}`} className="w-full inline-block px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors mb-3 font-semibold">
                  Book Now
                </Link>

                <Button variant="outline" fullWidth>
                  Message Landlord
                </Button>
              </CardContent>
            </Card>

            {/* Key Info */}
            <Card>
              <CardContent className="pt-6 space-y-3">
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

            {/* Landlord Info */}
            <Card>
              <CardHeader>
                <CardTitle>Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {listing.landlordContact.profileImage && (
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 overflow-hidden">
                      <Image src={listing.landlordContact.profileImage} alt={listing.landlordContact.name} width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h4 className="font-semibold">{listing.landlordContact.name}</h4>
                  <p className="text-sm text-gray-600">Verified Landlord</p>
                  <p className="text-sm text-gray-600 mt-2">✓ 98% Response Rate</p>
                  <Button variant="secondary" fullWidth className="mt-4">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-300 h-48 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">📍 {listing.location.city}, {listing.location.state}</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </>
  )
}
