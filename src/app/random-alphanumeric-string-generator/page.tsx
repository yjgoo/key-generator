import { Metadata } from 'next';
import { GeneratorPage } from '@/components/GeneratorPage';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'alphanumeric';
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
    'random alphanumeric',
    'alphanumeric generator',
    'letters numbers string',
    'alphanumeric string',
    'random alphanumeric code',
    'letter number combination',
    'clean string generator',
    'simple random string'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/random-alphanumeric-string-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/random-alphanumeric-string-generator',
  },
};

export default function RandomAlphanumericStringPage() {
  if (!generator) {
    notFound();
  }

  return (
    <GeneratorPage
      generator={generator}
      seoDescription="Generate random alphanumeric strings containing only letters and numbers. Perfect for creating clean codes, user-friendly identifiers, and tokens without special characters."
      pageUrl="https://key-generator.com/random-alphanumeric-string-generator"
    />
  );
}
