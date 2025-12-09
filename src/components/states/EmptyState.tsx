'use client'

import Button from '@/components/ui/Button'

/**
 * Empty State Component
 * 
 * Displayed when there's no data to show
 * 
 * @example
 * ```tsx
 * {listings.length === 0 ? (
 *   <EmptyState
 *     title="No listings found"
 *     description="Try adjusting your filters or browse all listings"
 *     icon="🏠"
 *     action={{
 *       label: "Browse all listings",
 *       onClick: () => router.push('/search')
 *     }}
 *   />
 * ) : (
 *   <ListingsGrid listings={listings} />
 * )}
 * ```
 */
interface EmptyStateProps {
  title: string
  description?: string
  icon?: string | React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icon = '📭',
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  )
}

/**
 * Error State Component
 * 
 * Displayed when an error occurs while loading data
 * 
 * @example
 * ```tsx
 * {error ? (
 *   <ErrorState
 *     title="Failed to load listings"
 *     message={error.message}
 *     onRetry={() => queryClient.invalidateQueries({ queryKey: ['listings'] })}
 *   />
 * ) : (
 *   <ListingsGrid listings={listings} />
 * )}
 * ```
 */
interface ErrorStateProps {
  title: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title,
  message,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </div>
  )
}

/**
 * Error Fallback Component
 * 
 * Used with Error Boundaries to show a fallback UI on error
 */
interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-5xl mb-4 text-center">😞</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-6 text-center">{error.message}</p>
        <div className="space-y-3">
          <Button
            onClick={resetErrorBoundary}
            variant="primary"
            fullWidth
          >
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            fullWidth
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmptyState
