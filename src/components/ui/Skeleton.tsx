'use client'

/**
 * Skeleton Loader Component - Generic
 * 
 * Used as a base for other skeleton components
 */
interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  circle?: boolean
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  className = '',
  circle = false,
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${className} ${circle ? 'rounded-full' : 'rounded'}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

export default Skeleton
