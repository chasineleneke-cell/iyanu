'use client'

import { useState } from 'react'
import Navbar from '@/components/common/Navbar'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/states/EmptyState'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useGetMessages, useSendMessage } from '@/hooks/useMessages'
import { toastSuccess, toastError } from '@/utils/toast'

interface Conversation {
  userId: string
  userName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function TenantMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])

  const { data: messagesData, isLoading } = useGetMessages()
  const { mutate: sendMessage, isPending: isSending } = useSendMessage()

  const selectedMessages = selectedConversation 
    ? messagesData?.filter((m: any) => m.userId === selectedConversation) || []
    : []

  const handleSendMessage = () => {
    if (!selectedConversation || !messageText.trim()) return

    sendMessage({
      recipientId: selectedConversation,
      content: messageText
    }, {
      onSuccess: () => {
        setMessageText('')
        toastSuccess('Message sent')
      },
      onError: (err: any) => {
        toastError(err.message || 'Failed to send message')
      }
    })
  }

  return (
    <>
      <Navbar isAuthenticated={true} userRole="tenant" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6 min-h-[500px]">
          {/* Conversations List */}
          <div className="bg-white border rounded-lg">
            <div className="p-4 border-b">
              <Input 
                placeholder="Search conversations..." 
                className="w-full"
              />
            </div>

            {isLoading ? (
              <div className="space-y-2 p-2">
                {Array(5).fill(null).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : messagesData && messagesData.length === 0 ? (
              <div className="p-4">
                <p className="text-center text-gray-500 text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {messagesData?.map((message: any) => (
                  <button
                    key={message.userId}
                    onClick={() => setSelectedConversation(message.userId)}
                    className={`w-full p-3 text-left hover:bg-gray-50 transition ${
                      selectedConversation === message.userId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{message.userName}</p>
                      {message.unreadCount > 0 && (
                        <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {message.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">{message.lastMessage}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white border rounded-lg flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b">
                  <h2 className="font-semibold">
                    {messagesData?.find((m: any) => m.userId === selectedConversation)?.username || 'User'}
                  </h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    selectedMessages.map((msg: any, i: number) => (
                      <div 
                        key={i}
                        className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.isFromMe 
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.isFromMe ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t space-y-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSendMessage}
                      disabled={isSending || !messageText.trim()}
                      variant="primary"
                    >
                      {isSending ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
