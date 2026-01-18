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
    'bcrypt': 'bcrypt-hash-generator',
    'random-string': 'random-string-generator',
    'uuid': 'random-uuid-generator',
    'hex-color': 'random-hex-color-generator',
    'base64': 'random-base64-string-generator',
    'alphanumeric': 'random-alphanumeric-string-generator',
    'numeric': 'random-numeric-string-generator',
    'mac-address': 'random-mac-address-generator',
    'jwt-secret-key': 'random-jwt-secret-key-generator',
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
      url: `${baseUrl}/cryptography/rsa/key-generator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cryptography/rsa/sign`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cryptography/rsa/verify`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cryptography/rsa/encryption`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cryptography/rsa/decryption`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cryptography/aes/encryption`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cryptography/aes/decryption`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cryptography/des/encryption`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cryptography/des/decryption`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
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
