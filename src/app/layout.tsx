import type { Metadata } from 'next'
import { ReactNode } from 'react'
import './globals.css'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import ErrorBoundary from '@/components/states/ErrorBoundary'
import { defaultMetadata } from '@/utils/seo'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: {
    default: 'RentNG - Find Your Perfect Apartment in Nigeria',
    template: '%s | RentNG',
  },
  description:
    'Discover affordable and comfortable apartments across Nigeria. Browse listings, book instantly, and manage your rental with ease.',
  keywords: [
    'apartment rental',
    'Nigeria',
    'rent',
    'housing',
    'flat',
    'accommodation',
  ],
  openGraph: {
    title: 'RentNG - Find Your Perfect Apartment in Nigeria',
    description:
      'Discover affordable and comfortable apartments across Nigeria.',
    type: 'website',
    locale: 'en_NG',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://rentng.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentNG',
    description: 'Find your perfect apartment in Nigeria',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-NG" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <ErrorBoundary>
          <QueryProvider>
            <ToastProvider />
            {children}
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
