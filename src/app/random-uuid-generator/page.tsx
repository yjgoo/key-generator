import { Metadata } from 'next';
import { GeneratorPage } from '@/components/GeneratorPage';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'uuid';
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
    'random UUID',
    'UUID generator',
    'GUID generator',
    'universally unique identifier',
    'RFC 4122',
    'unique ID',
    'random identifier',
    'UUID v4'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/random-uuid-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/random-uuid-generator',
  },
};

export default function RandomUUIDPage() {
  if (!generator) {
    notFound();
  }

  return (
    <GeneratorPage
      generator={generator}
      seoTitle={pageTitle}
      seoDescription="Generate RFC 4122 compliant universally unique identifiers (UUIDs). Perfect for database primary keys, session IDs, and any application requiring globally unique identifiers."
      pageUrl="https://key-generator.com/random-uuid-generator"
    />
  );
}
