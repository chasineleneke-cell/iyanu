/**
 * Home Page
 * Landing page for tenant users with search and featured listings
 */

'use client'

import { useState } from 'react'
import Navbar from '@/components/common/Navbar'
import Link from 'next/link'
import { useSearchListings } from '@/hooks/useListings'
import { Skeleton } from '@/components/ui/Skeleton'
import Badge from '@/components/ui/Badge'
import { formatNGN } from '@/utils/nigerian-locale'

export default function HomePage() {
  const [searchState, setSearchState] = useState('')
  
  // Fetch featured listings (limit to 6 for homepage)
  const { data: featuredResponse, isLoading } = useSearchListings({
    limit: 6
  })

  const featuredListings = featuredResponse?.data || []

  return (
    <>
      <Navbar isAuthenticated={false} />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Apartment in Nigeria</h1>
            <p className="text-xl mb-8 opacity-90">Browse thousands of verified listings and find your ideal home</p>
            
            {/* Quick Search */}
            <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="City or State" 
                  value={searchState}
                  onChange={(e) => setSearchState(e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg text-gray-900" 
                />
                <select className="flex-1 px-4 py-3 border rounded-lg text-gray-900">
                  <option>All Types</option>
                  <option>1 Bedroom</option>
                  <option>2 Bedrooms</option>
                  <option>3+ Bedrooms</option>
                </select>
                <Link href={searchState ? `/search?state=${searchState}` : '/search'} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 whitespace-nowrap">
                  Search
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Featured Apartments</h2>
          
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {Array(6).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No featured listings available at the moment</p>
              <Link href="/search" className="text-blue-600 hover:underline font-semibold">
                Browse all listings
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {/* Image */}
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-48 flex items-center justify-center">
                      <span className="text-4xl">🏠</span>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      {/* Title and Badge */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold flex-1">{listing.title}</h3>
                      </div>
                      
                      {/* Location */}
                      <p className="text-gray-600 text-sm mb-2">
                        📍 {listing.location?.address || 'Nigeria'}
                      </p>
                      
                      {/* Features */}
                      <div className="flex gap-3 text-xs text-gray-600 mb-4 pb-4 border-b">
                        {listing.bedrooms && <span>🛏️ {listing.bedrooms} BR</span>}
                        {listing.bathrooms && <span>🚿 {listing.bathrooms} BA</span>}
                        {listing.size && <span>📐 {listing.size} m²</span>}
                      </div>
                      
                      {/* Price */}
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600">
                          {formatNGN(listing.price)}
                        </span>
                        <span className="text-blue-600 hover:underline font-semibold">
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Link */}
          <div className="text-center mt-12">
            <Link href="/search" className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50">
              View All Apartments
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your New Home?</h2>
            <p className="text-gray-600 mb-8">Browse our extensive listings or create an account to save your favorites</p>
            <div className="flex gap-4 justify-center">
              <Link href="/search" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Browse Apartments
              </Link>
              <Link href="/register" className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50">
                Sign Up
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 RentNG. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
