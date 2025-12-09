/**
 * Admin/Landlord Login Page
 */

'use client'

import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Connect to backend authentication
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mx-auto mb-3"></div>
            <CardTitle className="text-2xl">Landlord Portal</CardTitle>
            <p className="text-sm text-gray-600 mt-2">Manage your properties and bookings</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <Input label="Email Address" type="email" placeholder="landlord@email.com" required />

            <Input label="Password" type="password" placeholder="••••••••" required />

            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign In
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/admin/register" className="text-blue-600 hover:underline font-semibold">
                  Create One
                </Link>
              </p>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">
                Tenant Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
