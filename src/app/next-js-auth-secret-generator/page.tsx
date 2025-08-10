import { Metadata } from 'next';
import { GeneratorPage } from '@/components/GeneratorPage';
import { getGenerator } from '@/lib/keyGenerators';
import { generatePageTitle, generateMetaDescription } from '@/lib/utils';
import { notFound } from 'next/navigation';

const generatorId = 'nextjs-auth';
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
    'Next.js auth secret',
    'NextJS authentication',
    'auth secret generator',
    'secure authentication',
    'JWT secret',
    'session secret',
    'authentication key',
    'secure key generator'
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: 'website',
    url: 'https://key-generator.com/next-js-auth-secret-generator',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: 'https://key-generator.com/next-js-auth-secret-generator',
  },
};

export default function NextJSAuthSecretPage() {
  if (!generator) {
    notFound();
  }

  return (
    <GeneratorPage
      generator={generator}
      seoTitle={pageTitle}
      seoDescription="Generate secure authentication secrets specifically designed for Next.js applications. These cryptographically secure keys are perfect for JWT signing, session management, and other authentication purposes in your Next.js projects."
      pageUrl="https://key-generator.com/next-js-auth-secret-generator"
    />
  );
}
