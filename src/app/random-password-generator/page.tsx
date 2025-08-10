import { Metadata } from 'next';
import { GeneratorPage } from '@/components/GeneratorPage';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'password';
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
    'random password',
    'password generator',
    'strong password',
    'secure password',
    'random password creator',
    'password maker',
    'safe password',
    'complex password'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/random-password-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/random-password-generator',
  },
};

export default function RandomPasswordPage() {
  if (!generator) {
    notFound();
  }

  return (
    <GeneratorPage
      generator={generator}
      seoTitle={pageTitle}
      seoDescription="Generate strong random passwords with mixed characters including uppercase, lowercase, numbers, and special symbols. Create secure passwords for accounts, applications, and services with customizable length."
      pageUrl="https://key-generator.com/random-password-generator"
    />
  );
}
