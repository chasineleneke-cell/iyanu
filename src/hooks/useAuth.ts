'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import apiClient from '@/services/api'
import type { AuthResponse, User } from '@/types'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: 'tenant' | 'admin'
}

/**
 * Hook for getting current user profile
 */
export function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: User }>('/auth/me')
      return response.data.data
    },
  })
}

/**
 * Hook for user login
 * 
 * @example
 * ```tsx
 * const { mutate: login, isPending } = useLogin()
 * const handleSubmit = async (data) => {
 *   login(data, {
 *     onSuccess: () => router.push('/tenant/dashboard')
 *   })
 * }
 * ```
 */
export function useLogin() {
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await apiClient.post<{ success: boolean; message: string; data: AuthResponse }>('/auth/login', payload)
      return response.data.data
    },
    onSuccess: (data) => {
      setUser(data.user)
      localStorage.setItem('accessToken', data.accessToken)
    },
  })
}

/**
 * Hook for user registration
 * 
 * @example
 * ```tsx
 * const { mutate: register, isPending } = useRegister()
 * const handleSubmit = async (data) => {
 *   register(data, {
 *     onSuccess: () => router.push('/login')
 *   })
 * }
 * ```
 */
export function useRegister() {
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await apiClient.post<{ success: boolean; message: string; data: AuthResponse }>('/auth/register', payload)
      return response.data.data
    },
    onSuccess: (data) => {
      setUser(data.user)
      localStorage.setItem('accessToken', data.accessToken)
    },
  })
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const { logout } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout')
    },
    onSuccess: () => {
      logout()
    },
  })
}

/**
 * Hook for refreshing authentication token
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<{ success: boolean; message: string; data: { accessToken: string } }>('/auth/refresh')
      return response.data.data
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
    },
  })
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (payload: Partial<User>) => {
      const response = await apiClient.put<{ success: boolean; message: string; data: User }>(
        '/auth/profile',
        payload
      )
      return response.data.data
    },
    onSuccess: (user) => {
      setUser(user)
    },
  })
}

/**
 * Hook for uploading user avatar
 */
export function useUploadAvatar() {
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (imageUrl: string) => {
      const response = await apiClient.post<{ success: boolean; message: string; data: User }>(
        '/auth/profile-image',
        { imageUrl }
      )
      return response.data.data
    },
    onSuccess: (user) => {
      setUser(user)
    },
  })
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: {
      currentPassword: string
      newPassword: string
    }) => {
      await apiClient.post('/auth/change-password', payload)
    },
  })
}
