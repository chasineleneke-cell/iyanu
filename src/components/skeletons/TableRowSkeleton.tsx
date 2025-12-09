'use client'

import Skeleton from '@/components/ui/Skeleton'

/**
 * Table Row Skeleton Loader
 * 
 * Placeholder component for table rows while data is loading
 */
interface TableRowSkeletonProps {
  columns?: number
  count?: number
}

export function TableRowSkeleton({ columns = 5, count = 3 }: TableRowSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              width={`${90 / columns}%`}
              height={16}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Dashboard Card Skeleton
 * 
 * Placeholder for KPI/dashboard cards
 */
export function DashboardCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <Skeleton width="50%" height={14} className="mb-3" />
      <Skeleton width="80%" height={24} className="mb-2" />
      <Skeleton width="40%" height={12} />
    </div>
  )
}

/**
 * Dashboard Grid Skeleton
 * 
 * Shows multiple dashboard card skeletons
 */
export function DashboardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: count }).map((_, index) => (
        <DashboardCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default TableRowSkeleton
