/**
 * API Client Service
 * Re-exports the axios instance from lib/api
 * All authentication and token refresh handled by lib/api interceptors
 */

export { default as apiClient } from '@/lib/api'
export { default } from '@/lib/api'

