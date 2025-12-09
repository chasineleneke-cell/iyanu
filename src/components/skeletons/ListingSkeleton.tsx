'use client'

import Skeleton from '@/components/ui/Skeleton'

/**
 * Listing Card Skeleton Loader
 * 
 * Placeholder component shown while listing data is loading
 */
export function ListingSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Skeleton */}
      <Skeleton width="100%" height={200} className="w-full" />

      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <Skeleton width="80%" height={18} />

        {/* Location Skeleton */}
        <Skeleton width="60%" height={14} />

        {/* Price Skeleton */}
        <Skeleton width="40%" height={16} className="mb-2" />

        {/* Amenities Skeleton */}
        <div className="flex gap-2">
          <Skeleton width={60} height={24} className="rounded-full" />
          <Skeleton width={60} height={24} className="rounded-full" />
          <Skeleton width={60} height={24} className="rounded-full" />
        </div>

        {/* Button Skeleton */}
        <Skeleton width="100%" height={36} className="rounded" />
      </div>
    </div>
  )
}

/**
 * Listings Grid Skeleton
 * 
 * Shows multiple listing skeletons in a grid layout
 */
export function ListingsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ListingSkeleton key={index} />
      ))}
    </div>
  )
}

export default ListingSkeleton
