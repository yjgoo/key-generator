import { MetadataRoute } from 'next'
import { keyGenerators } from '@/lib/keyGenerators'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://key-generator.com'
  
  // Generator page mappings
  const slugMap: Record<string, string> = {
    'nextjs-auth': 'next-js-auth-secret-generator',
    'secure-key': 'secure-strong-secret-key-generator',
    'api-key': 'random-api-key-generator',
    'password': 'random-password-generator',
    'random-string': 'random-string-generator',
    'uuid': 'random-uuid-generator',
    'hex-color': 'random-hex-color-generator',
    'base64': 'random-base64-string-generator',
    'alphanumeric': 'random-alphanumeric-string-generator',
    'numeric': 'random-numeric-string-generator',
    'mac-address': 'random-mac-address-generator',
    'jwt-secret': 'random-jwt-secret-generator',
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Generator pages
  const generatorPages = keyGenerators.map((generator) => ({
    url: `${baseUrl}/${slugMap[generator.id]}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...generatorPages]
}
