import { Metadata } from 'next';
import { GeneratorPage } from '@/components/GeneratorPage';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'numeric';
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
    'random numeric string',
    'random numbers',
    'numeric generator',
    'number string',
    'random digits',
    'numeric code',
    'number generator',
    'digit string'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/random-numeric-string-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/random-numeric-string-generator',
  },
};

export default function RandomNumericStringPage() {
  if (!generator) {
    notFound();
  }

  return (
    <GeneratorPage
      generator={generator}
      seoTitle={pageTitle}
      seoDescription="Generate random numeric strings containing only digits (0-9). Perfect for creating PIN codes, numeric IDs, verification codes, and any application requiring number-only strings."
      pageUrl="https://key-generator.com/random-numeric-string-generator"
    />
  );
}
