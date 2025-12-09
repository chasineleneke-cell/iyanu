/**
 * SEO Metadata Configuration
 * 
 * Provides reusable metadata and OG tags for pages
 */

export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  canonical?: string
  robots?: string
  author?: string
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'RentNG'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rentng.app'
const DEFAULT_OG_IMAGE = `${APP_URL}/og-image.jpg`

/**
 * Generate metadata for a page
 */
export function generateMetadata(metadata: SEOMetadata) {
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords?.join(', '),
    authors: metadata.author ? [{ name: metadata.author }] : [],
    robots: metadata.robots || 'index, follow',
    openGraph: {
      title: metadata.ogTitle || metadata.title,
      description: metadata.ogDescription || metadata.description,
      images: [
        {
          url: metadata.ogImage || DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: metadata.ogTitle || metadata.title,
        },
      ],
      type: metadata.ogType || 'website',
      url: metadata.canonical || APP_URL,
    },
    alternates: {
      canonical: metadata.canonical,
    },
  }
}

/**
 * Common SEO metadata templates
 */
export const METADATA = {
  home: {
    title: `${APP_NAME} - Find Your Perfect Apartment in Nigeria`,
    description: 'Discover affordable and comfortable apartments across Nigeria. Browse listings, book instantly, and manage your rental with ease.',
    keywords: ['apartment', 'rental', 'Nigeria', 'flat', 'accommodation', 'house'],
  },
  search: {
    title: `Search Apartments | ${APP_NAME}`,
    description: 'Search and filter apartments by location, price, bedrooms, and amenities.',
    keywords: ['search', 'apartment', 'filter', 'listings'],
  },
  login: {
    title: `Login | ${APP_NAME}`,
    description: 'Login to your RentNG account to manage bookings and messages.',
    keywords: ['login', 'signin', 'account'],
  },
  register: {
    title: `Sign Up | ${APP_NAME}`,
    description: 'Create a RentNG account to start booking apartments or listing your properties.',
    keywords: ['signup', 'register', 'account', 'join'],
  },
  adminDashboard: {
    title: `Landlord Dashboard | ${APP_NAME}`,
    description: 'Manage your properties, bookings, and revenue from your landlord dashboard.',
    keywords: ['dashboard', 'admin', 'landlord', 'properties'],
  },
  tenantDashboard: {
    title: `My Dashboard | ${APP_NAME}`,
    description: 'View your bookings, messages, and account information.',
    keywords: ['dashboard', 'bookings', 'tenant'],
  },
}

/**
 * Default head configuration for all pages
 */
export const defaultMetadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Find, book, and manage apartments in Nigeria with ease.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#2563eb',
}

/**
 * Structured data for SEO
 */
export function generateStructuredData(type: 'organization' | 'website' | 'apartment') {
  const baseData = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: APP_NAME,
        url: APP_URL,
        logo: `${APP_URL}/logo.png`,
        sameAs: [
          'https://www.facebook.com/rentng',
          'https://www.twitter.com/rentng',
          'https://www.instagram.com/rentng',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          email: 'support@rentng.app',
        },
      }

    case 'website':
      return {
        ...baseData,
        '@type': 'WebSite',
        name: APP_NAME,
        url: APP_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${APP_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }

    case 'apartment':
      return {
        ...baseData,
        '@type': 'Apartment',
        name: 'Apartment',
        description: 'Residential apartment for rent',
        currency: 'NGN',
      }

    default:
      return baseData
  }
}
