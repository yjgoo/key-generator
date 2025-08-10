import { Metadata } from 'next';
import { GeneratorPage } from '@/components/GeneratorPage';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'mac-address';
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
    'random MAC address',
    'MAC address generator',
    'media access control',
    'network address',
    'ethernet address',
    'hardware address',
    'network testing',
    'MAC generator'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/random-mac-address-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/random-mac-address-generator',
  },
};

export default function RandomMACAddressPage() {
  if (!generator) {
    notFound();
  }

  return (
    <GeneratorPage
      generator={generator}
      seoDescription="Generate random MAC addresses in standard format (XX:XX:XX:XX:XX:XX) for network testing, simulation, and development purposes. Create valid media access control addresses for your projects."
      pageUrl="https://key-generator.com/random-mac-address-generator"
    />
  );
}
