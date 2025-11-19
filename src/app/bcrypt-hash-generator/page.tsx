import { Metadata } from 'next';
import { BcryptGenerator } from './client';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'bcrypt';
const generator = getGenerator(generatorId);

if (!generator) {
  // This should not happen if configuration is correct
  // But we handle it for type safety in metadata export
}

const pageTitle = generator ? generatePageTitle(generator.title) : 'Bcrypt Hash Generator';
const pageDescription = generator ? generateMetaDescription(generator.title, generator.description) : 'Generate secure Bcrypt password hashes online.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'bcrypt generator',
    'bcrypt hash',
    'password hash',
    'bcrypt online',
    'hash generator',
    'password encryption',
    'secure password hash'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/bcrypt-hash-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/bcrypt-hash-generator',
  },
};

export default function BcryptGeneratorPage() {
  if (!generator) {
    notFound();
  }

  return <BcryptGenerator generator={generator} />;
}
