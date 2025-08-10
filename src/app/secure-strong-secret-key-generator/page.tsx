import { Metadata } from 'next';
import { GeneratorPage } from '@/components/GeneratorPage';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'secure-key';
const generator = getGenerator(generatorId);

if (!generator) {
  notFound();
}

const pageTitle = generatePageTitle(generator.title);
const pageDescription = generateMetaDescription(generator.title, generator.description);

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'secure secret key',
    'strong secret key',
    'cryptographic key',
    'secure key generator',
    'random secret',
    'encryption key',
    'security key',
    'secure random'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/secure-strong-secret-key-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/secure-strong-secret-key-generator',
  },
};

export default function SecureStrongSecretKeyPage() {
  if (!generator) {
    notFound();
  }

  return (
    <GeneratorPage
      generator={generator}
      seoDescription="Generate cryptographically secure and strong secret keys with customizable length. Perfect for encryption, API authentication, and other security-critical applications that require high-entropy random keys."
      pageUrl="https://key-generator.com/secure-strong-secret-key-generator"
    />
  );
}
