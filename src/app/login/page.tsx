/**
 * Tenant Login Page
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/common/Navbar'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { loginSchema, type LoginFormData } from '@/utils/validation'
import { useLogin } from '@/hooks/useAuth'

export default function TenantLoginPage() {
  const router = useRouter()
  const { mutate: login, isPending } = useLogin()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.push('/tenant/dashboard')
        },
        onError: (error: any) => {
          setError(
            error?.response?.data?.message || 'Login failed. Please try again.'
          )
        },
      }
    )
  }

  return (
    <>
      <Navbar isAuthenticated={false} />

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Tenant Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                  {...register('rememberMe')}
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>

              <Button type="submit" fullWidth isLoading={isPending}>
                Sign In
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                    Sign Up
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <Link href="/admin/login" className="text-sm text-gray-600 hover:text-blue-600">
                  Landlord Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
