import { Metadata } from 'next';
import { GeneratorPage } from '@/components/GeneratorPage';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'base64';
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
    'random base64',
    'base64 generator',
    'base64 string',
    'encoded string',
    'base64 encoder',
    'random encoded data',
    'base64 random',
    'encoded generator'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/random-base64-string-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/random-base64-string-generator',
  },
};

export default function RandomBase64StringPage() {
  if (!generator) {
    notFound();
  }

  return (
    <GeneratorPage
      generator={generator}
      seoDescription="Generate random Base64 encoded strings for data encoding, tokens, and secure data transmission. Perfect for creating encoded identifiers, session tokens, and API keys that need Base64 encoding."
      pageUrl="https://key-generator.com/random-base64-string-generator"
    />
  );
}
