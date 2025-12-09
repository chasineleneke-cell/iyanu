'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'admin' | 'tenant'
}

/**
 * ProtectedRoute Component
 * 
 * Wraps client-side pages to enforce authentication and role-based access control.
 * Redirects unauthenticated users or users with insufficient permissions.
 * 
 * @example
 * ```tsx
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to appropriate login page
      if (pathname.startsWith('/admin')) {
        router.push('/admin/login')
      } else {
        router.push('/login')
      }
      return
    }

    // Check if user has required role
    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard
      if (user?.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/tenant/dashboard')
      }
      return
    }

    // All checks passed
    setIsChecking(false)
  }, [isAuthenticated, user, requiredRole, pathname, router])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
