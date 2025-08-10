import { Metadata } from 'next';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';

const generatorId = 'jwt-secret';
const generator = getGenerator(generatorId);

if (!generator) {
  throw new Error('Generator not found');
}

const pageTitle = generatePageTitle(generator.title);
const pageDescription = generateMetaDescription(generator.title, generator.description);

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'random JWT secret',
    'JWT secret generator',
    'JSON web token',
    'JWT signing key',
    'token secret',
    'authentication secret',
    'JWT key',
    'secure token signing'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/random-jwt-secret-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/random-jwt-secret-generator',
  },
};
