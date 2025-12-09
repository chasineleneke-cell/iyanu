/**
 * Search & Browse Apartments Page
 * Allows tenants to search, filter, and view apartment listings with React Query
 */

'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Navbar from '@/components/common/Navbar'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { NIGERIAN_STATES, BEDROOM_OPTIONS, formatNGN } from '@/utils/nigerian-locale'
import { useSearchListings } from '@/hooks/useListings'
import { ListingSkeleton } from '@/components/skeletons/ListingSkeleton'
import { EmptyState } from '@/components/states/EmptyState'
import { Pagination } from '@/components/Pagination'
import { toastError } from '@/utils/toast'

const AMENITIES_LIST = ['WiFi', 'Parking', '24/7 Water', 'Generator', 'Security', 'Gym']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

interface SearchFilters {
  state?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  amenities?: string[]
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating'
  page?: number
}

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    sortBy: 'newest',
  })

  const { data, isLoading, error, refetch } = useSearchListings({
    page: filters.page,
    state: filters.state,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    sortBy: filters.sortBy || 'newest',
  })

  const handleFilterChange = useCallback((key: keyof Omit<SearchFilters, 'amenities'>, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }, [])

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...(prev.amenities || []), amenity],
      page: 1,
    }))
  }

  const handleReset = () => {
    setFilters({ page: 1, sortBy: 'newest' })
  }

  if (error) {
    toastError(error.message || 'Failed to fetch listings')
  }

  return (
    <>
      <Navbar isAuthenticated={false} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Apartments</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Location */}
                  <div>
                    <Select
                      label="State"
                      value={filters.state || ''}
                      onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
                      options={NIGERIAN_STATES.map((state) => ({ value: state, label: state }))}
                      placeholder="Select state"
                    />
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <Select
                      label="Bedrooms"
                      value={filters.bedrooms?.toString() || ''}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                      options={BEDROOM_OPTIONS}
                      placeholder="Any bedrooms"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (NGN)</label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      />
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                    <div className="space-y-2">
                      {AMENITIES_LIST.map((amenity: string) => (
                        <label key={amenity} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded"
                            checked={filters.amenities?.includes(amenity) || false}
                            onChange={() => handleAmenityToggle(amenity)}
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <Select
                      label="Sort By"
                      value={filters.sortBy || 'newest'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                      options={SORT_OPTIONS}
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button onClick={() => refetch()} fullWidth>
                      Apply Filters
                    </Button>
                    <Button onClick={handleReset} fullWidth variant="outline">
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Listings */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="space-y-6">
                <ListingSkeleton />
                <ListingSkeleton />
                <ListingSkeleton />
              </div>
            ) : error ? (
              <EmptyState
                title="Error Loading Listings"
                description={error.message || 'Something went wrong while fetching listings'}
                action={{ label: 'Try Again', onClick: () => refetch() }}
              />
            ) : !data?.data || data.data.length === 0 ? (
              <EmptyState
                title="No Apartments Found"
                description="Try adjusting your filters to find more listings"
                action={{ label: 'Reset Filters', onClick: handleReset }}
              />
            ) : (
              <div className="space-y-6">
                {data.data.map((listing) => (
                  <Card key={listing.id} hover>
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-3 gap-4">
                        {/* Image */}
                        <div className="md:col-span-1 bg-gray-200 h-48 rounded-l-lg flex items-center justify-center overflow-hidden">
                          {listing.images?.[0] ? (
                            <Image src={listing.images[0]} alt={listing.title} width={300} height={200} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-500">No image</span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="md:col-span-2 p-6 flex flex-col justify-between">
                          <div>
                            <Link href={`/listing/${listing.id}`} className="inline-block">
                              <h3 className="text-xl font-bold hover:text-blue-600 transition-colors">{listing.title}</h3>
                            </Link>
                            <p className="text-gray-600 mb-2">{listing.location?.address}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {listing.amenities?.slice(0, 3).map((amenity) => (
                                <Badge key={amenity} variant="info">
                                  {amenity}
                                </Badge>
                              ))}
                              {listing.amenities && listing.amenities.length > 3 && (
                                <Badge variant="info">+{listing.amenities.length - 3} more</Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                              <div>
                                <span className="text-gray-600">Bedrooms:</span>
                                <p className="font-semibold">{listing.bedrooms}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Bathrooms:</span>
                                <p className="font-semibold">{listing.bathrooms}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Size:</span>
                                <p className="font-semibold">{listing.size} sqft</p>
                              </div>
                            </div>

                            {listing.averageRating && (
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="font-semibold">{listing.averageRating.toFixed(1)}</span>
                                <span className="text-gray-600 text-sm">({listing.totalReviews} reviews)</span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div>
                              <p className="text-sm text-gray-600">Price per month</p>
                              <p className="text-2xl font-bold text-green-600">{formatNGN(listing.price)}</p>
                            </div>
                            <Link href={`/listing/${listing.id}`} className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                {data && data.data && Array.isArray(data.data) && data.data.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={filters.page || 1}
                      totalPages={Math.ceil((data.total || data.data.length) / 10)}
                      onPageChange={(page) => handleFilterChange('page', page)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
