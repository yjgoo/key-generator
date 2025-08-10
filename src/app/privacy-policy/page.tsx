import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - Key Generator',
  description: 'Privacy Policy for Key Generator - Learn how we protect your privacy and handle data.',
  keywords: ['privacy policy', 'data protection', 'key generator privacy'],
  openGraph: {
    title: 'Privacy Policy - Key Generator',
    description: 'Privacy Policy for Key Generator - Learn how we protect your privacy and handle data.',
    type: 'website',
    url: 'https://key-generator.com/privacy-policy',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy - Key Generator',
    description: 'Privacy Policy for Key Generator - Learn how we protect your privacy and handle data.',
  },
  alternates: {
    canonical: 'https://key-generator.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> August 10, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Key Generator ("we," "our," or "us"). We are committed to protecting your privacy and ensuring transparency about how we handle your information. This Privacy Policy explains how we collect, use, and protect your information when you use our key generation services at key-generator.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Information We Don't Collect</h3>
              <p className="text-gray-700 mb-4">
                <strong>Generated Keys and Secrets:</strong> We do not store, log, or have access to any keys, passwords, secrets, or other cryptographic material you generate using our service. All key generation happens locally in your browser.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Information We May Collect</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Analytics Data:</strong> We may collect anonymous usage statistics such as page views, browser type, and general geographic location (country level) to improve our service.</li>
                <li><strong>Technical Information:</strong> Server logs may temporarily record IP addresses, user agents, and timestamps for security and technical purposes.</li>
                <li><strong>Cookies:</strong> We may use essential cookies for website functionality and analytics cookies to understand how our service is used.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Information</h2>
              <p className="text-gray-700 mb-4">
                Any information we collect is used solely for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Providing and maintaining our key generation service</li>
                <li>Improving website performance and user experience</li>
                <li>Analyzing usage patterns to enhance our features</li>
                <li>Ensuring security and preventing abuse</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of information. However, since we don't store your generated keys or secrets, the most sensitive data never leaves your browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We may use third-party services for analytics and website functionality. These services have their own privacy policies and may collect information about your use of our service. We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Our service may be accessed from anywhere in the world. Any data we collect may be processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have rights regarding your personal data, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to delete your data</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Since we don't store your generated keys or personal information, most of these rights are automatically protected by our privacy-by-design approach.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: privacy@key-generator.com<br />
                Website: <a href="https://key-generator.com" className="text-blue-600 hover:text-blue-800">https://key-generator.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
