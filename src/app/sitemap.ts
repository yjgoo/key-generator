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

  const cryptographyPages = [
    '/cryptography/rsa/key-generator',
    '/cryptography/rsa/sign',
    '/cryptography/rsa/verify',
    '/cryptography/rsa/encryption',
    '/cryptography/rsa/decryption',
    '/cryptography/aes/encryption',
    '/cryptography/aes/decryption',
    '/cryptography/des/encryption',
    '/cryptography/des/decryption',
  ]

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

  const cryptographyEntries = cryptographyPages.map((path) => {
    const isKeyGenerator = path.endsWith('/key-generator')
    const isRsa = path.startsWith('/cryptography/rsa')
    const priority = isKeyGenerator ? 0.8 : isRsa ? 0.7 : 0.6
    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority,
    }
  })

  return [...staticPages, ...cryptographyEntries, ...generatorPages]
}
