import { KeyGenerator } from '@/lib/keyGenerators';

interface StructuredDataProps {
  generator: KeyGenerator;
  pageUrl: string;
}

export function StructuredData({ generator, pageUrl }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${generator.title} Generator`,
    "description": generator.description,
    "url": pageUrl,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "permissions": "none",
    "isAccessibleForFree": true,
    "provider": {
      "@type": "Organization",
      "name": "Key Generator",
      "url": "https://key-generator.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Cryptographically secure generation",
      "Browser-based processing",
      "No data storage",
      "Instant generation",
      "Copy to clipboard",
      "Customizable options"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
