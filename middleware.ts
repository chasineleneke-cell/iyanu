import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/tenant/dashboard',
  '/tenant/bookings',
  '/tenant/messages',
  '/tenant/profile',
  '/admin/dashboard',
  '/admin/properties',
  '/admin/bookings',
  '/admin/messages',
  '/admin/profile',
]

// Define admin-only routes
const adminRoutes = [
  '/admin/dashboard',
  '/admin/properties',
  '/admin/bookings',
  '/admin/messages',
  '/admin/profile',
]

// Define tenant-only routes
const tenantRoutes = [
  '/tenant/dashboard',
  '/tenant/bookings',
  '/tenant/messages',
  '/tenant/profile',
]

// Define public routes that don't require auth
const publicRoutes = [
  '/',
  '/search',
  '/listing',
  '/login',
  '/admin/login',
  '/register',
  '/admin/register',
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('auth-token')?.value
  const role = request.cookies.get('user-role')?.value

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // If protected route, verify authentication
  if (isProtectedRoute) {
    if (!token) {
      // Redirect to appropriate login page
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verify role-based access
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (pathname.startsWith('/tenant') && role !== 'tenant') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    (pathname === '/login' || pathname === '/register') &&
    token &&
    role === 'tenant'
  ) {
    return NextResponse.redirect(new URL('/tenant/dashboard', request.url))
  }

  if (
    (pathname === '/admin/login' || pathname === '/admin/register') &&
    token &&
    role === 'admin'
  ) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
