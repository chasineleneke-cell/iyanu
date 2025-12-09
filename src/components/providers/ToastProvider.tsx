'use client'

import { Toaster } from 'react-hot-toast'

/**
 * Toast Provider Component
 * 
 * Wraps the entire application to enable toast notifications.
 * Should be placed in the root layout.
 * 
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { ToastProvider } from '@/components/providers/ToastProvider'
 * 
 * export default function RootLayout() {
 *   return (
 *     <html>
 *       <body>
 *         <ToastProvider />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#000',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          borderRadius: '0.5rem',
          padding: '1rem',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}
