import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rentng.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/search',
          '/listing',
          '/login',
          '/register',
          '/admin/login',
        ],
        disallow: [
          '/tenant/',
          '/admin/',
          '/api/',
          '/*.json$',
          '/*?*sort=',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
