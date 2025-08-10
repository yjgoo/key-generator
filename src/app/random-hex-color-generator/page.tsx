import { Metadata } from 'next';
import { GeneratorPage } from '@/components/GeneratorPage';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'hex-color';
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
    'random hex color',
    'hex color generator',
    'color picker',
    'random color',
    'hexadecimal color',
    'CSS color',
    'web color',
    'color code generator'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/random-hex-color-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/random-hex-color-generator',
  },
};

export default function RandomHexColorPage() {
  if (!generator) {
    notFound();
  }

  return (
    <GeneratorPage
      generator={generator}
      seoTitle={pageTitle}
      seoDescription="Generate random hexadecimal color codes for web design, CSS styling, and creative projects. Get instant hex color values in the standard #RRGGBB format for use in websites and applications."
      pageUrl="https://key-generator.com/random-hex-color-generator"
    />
  );
}
