'use client'

import React, { ReactNode } from 'react'
import { ErrorFallback } from './EmptyState'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary Component
 * 
 * Catches React errors and displays a fallback UI
 * 
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error) => console.error(error)}
 *   fallback={<CustomErrorUI />}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback || (
          <ErrorFallback
            error={this.state.error}
            resetErrorBoundary={this.resetError}
          />
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
