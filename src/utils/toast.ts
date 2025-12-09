import toast from 'react-hot-toast'

/**
 * Toast Utilities for consistent notification handling
 * 
 * Provides wrapper functions for success, error, loading, and custom toasts
 */

/**
 * Show success toast notification
 * 
 * @example
 * ```tsx
 * import { toastSuccess } from '@/utils/toast'
 * 
 * const handleSubmit = async () => {
 *   try {
 *     await submitForm()
 *     toastSuccess('Form submitted successfully!')
 *   } catch (error) {
 *     toastError('Failed to submit form')
 *   }
 * }
 * ```
 */
export function toastSuccess(message: string, options = {}) {
  return toast.success(message, {
    duration: 3000,
    ...options,
  })
}

/**
 * Show error toast notification
 */
export function toastError(message: string, options = {}) {
  return toast.error(message, {
    duration: 4000,
    ...options,
  })
}

/**
 * Show loading toast notification
 * Returns toast ID for later dismissal
 * 
 * @example
 * ```tsx
 * const toastId = toastLoading('Processing your request...')
 * try {
 *   await processRequest()
 *   toast.dismiss(toastId)
 *   toastSuccess('Done!')
 * } catch (error) {
 *   toast.dismiss(toastId)
 *   toastError('Failed!')
 * }
 * ```
 */
export function toastLoading(message: string, options = {}) {
  return toast.loading(message, {
    ...options,
  })
}

/**
 * Show custom toast notification
 */
export function toastCustom(message: string, options = {}) {
  return toast(message, {
    duration: 3000,
    ...options,
  })
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts() {
  toast.remove()
}

/**
 * Show validation error toast
 */
export function toastValidationError(errors: Record<string, string>) {
  const errorMessages = Object.entries(errors)
    .map(([_, message]) => message)
    .slice(0, 3) // Show max 3 errors

  const message =
    errorMessages.length > 1
      ? `${errorMessages.length} validation errors`
      : errorMessages[0]

  return toastError(message)
}

/**
 * Handle API error response and show appropriate toast
 * 
 * @example
 * ```tsx
 * try {
 *   await apiCall()
 * } catch (error) {
 *   handleApiError(error)
 * }
 * ```
 */
export function handleApiError(error: any) {
  if (error?.response?.data?.message) {
    toastError(error.response.data.message)
  } else if (error?.message) {
    toastError(error.message)
  } else {
    toastError('An unexpected error occurred. Please try again.')
  }
}

/**
 * Promise-based toast for async operations
 * 
 * @example
 * ```tsx
 * toastPromise(
 *   submitForm(),
 *   {
 *     loading: 'Submitting...',
 *     success: 'Form submitted!',
 *     error: 'Failed to submit form',
 *   }
 * )
 * ```
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  }
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  })
}

export default toast
