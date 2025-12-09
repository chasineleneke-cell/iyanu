/**
 * Navbar Component
 * Top navigation for tenant/public side
 */

'use client'

import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

interface NavbarProps {
  isAuthenticated?: boolean
  userRole?: 'tenant' | 'admin'
  onLogout?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false, userRole = 'tenant', onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={userRole === 'admin' ? '/admin/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="font-bold text-lg text-gray-900">RentNG</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {userRole === 'tenant' && (
              <>
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Browse
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  href={userRole === 'admin' ? '/admin/dashboard' : '/tenant/dashboard'}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {userRole === 'tenant' && (
              <>
                <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Home
                </Link>
                <Link href="/search" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Browse
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  href={userRole === 'admin' ? '/admin/dashboard' : '/tenant/dashboard'}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Dashboard
                </Link>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Login
                </Link>
                <Link href="/register" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
