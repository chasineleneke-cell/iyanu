/**
 * Messaging Hooks
 * Custom hooks for messaging functionality
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api'
import type { PaginatedResponse } from '@/types'

interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  isRead: boolean
  createdAt: Date
}

interface Conversation {
  userId: string
  username: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
}

/**
 * Hook to get messages/conversations for the current user
 */
export function useGetMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: Conversation[] }>(
        '/messages'
      )
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get messages with a specific user
 */
export function useGetConversation(userId: string) {
  return useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; message: string; data: Message[] }>(
        `/messages/${userId}`
      )
      return response.data.data
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { recipientId: string; content: string }) => {
      const response = await apiClient.post<{ success: boolean; message: string; data: Message }>(
        '/messages/send',
        data
      )
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      queryClient.invalidateQueries({ queryKey: ['messages', variables.recipientId] })
    },
  })
}

/**
 * Hook to mark message as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageId: string) => {
      await apiClient.post(`/messages/${messageId}/mark-as-read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}
