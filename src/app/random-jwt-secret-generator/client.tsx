'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StructuredData } from '@/components/StructuredData';
import { KeyGenerator, generateKey as generateKeyUtil } from '@/lib/keyGenerators';

interface JWTSecretGeneratorClientProps {
  generator: KeyGenerator;
}

export function JWTSecretGeneratorClient({ generator }: JWTSecretGeneratorClientProps) {
  const [generatedKey, setGeneratedKey] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState(generator.defaultOptions || {});

  const generateKey = useCallback(() => {
    const newKey = generateKeyUtil(generator.id, options);
    setGeneratedKey(newKey);
    setCopied(false);
  }, [generator.id, options]);

  // Generate initial key on mount
  useEffect(() => {
    generateKey();
  }, [generateKey]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleOptionChange = (key: string, value: number | string) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
  };

  const getLength = () => {
    const length = options.length || generator.defaultOptions?.length || 64;
    return typeof length === 'number' ? length : 64;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StructuredData generator={generator} pageUrl="https://key-generator.com/random-jwt-secret-generator" />
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">Home</Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">{generator.title}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {generator.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate cryptographically secure JWT signing keys for your authentication system. 
            Perfect for JSON Web Token implementation in web applications and APIs.
          </p>
        </div>

        {/* Generator Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="space-y-6">
            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Key Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                    Key Length
                    <span className="ml-2 text-gray-500 text-xs">
                      ({getLength()} characters = {getLength() * 4} bits)
                    </span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      id="length"
                      min="8"
                      max="512"
                      step="8"
                      value={getLength()}
                      onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(getLength() - 8) / (512 - 8) * 100}%, #e5e7eb ${(getLength() - 8) / (512 - 8) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>8 chars (32 bits)</span>
                      <span>512 chars (2048 bits)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recommended Lengths
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[32, 64, 128, 256].map((length) => (
                      <button
                        key={length}
                        onClick={() => handleOptionChange('length', length)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          getLength() === length
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {length} chars ({length * 4} bits)
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Key Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated JWT Secret</h3>
              <div className="relative">
                <textarea
                  value={generatedKey}
                  readOnly
                  rows={generatedKey.length > 80 ? 4 : 2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Click generate to create a new JWT secret..."
                />
                {generatedKey && (
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateKey}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Generate New JWT Secret
            </button>

            {copied && (
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied to clipboard!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Understanding JWT Secret Keys */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Understanding JWT Secret Keys
            </h2>
            <p className="text-gray-600 mb-6">
              JSON Web Tokens (JWT) have become the industry standard for secure authentication and information exchange between parties. 
              At the heart of JWT security lies the secret key, a critical component that ensures the integrity and authenticity of your tokens.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What is a JWT Secret Key?
            </h3>
            <p className="text-gray-600 mb-6">
              A JWT secret key is a private cryptographic key used to sign JSON Web Tokens. This signature is crucial as it verifies 
              that the sender of the JWT is who it claims to be and ensures the message wasn&apos;t changed along the way. The secret key 
              should be kept secure and known only to the application that issues the token and the application that verifies it.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Why Secret Key Strength Matters
            </h3>
            <p className="text-gray-600 mb-6">
              The strength of your JWT secret key directly impacts the security of your entire authentication system. A weak or 
              predictable secret key can be compromised through brute force attacks, potentially allowing attackers to forge 
              valid tokens and gain unauthorized access to protected resources.
            </p>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Best Practices for JWT Secret Keys
            </h2>
            <p className="text-gray-600 mb-6">
              When generating and managing JWT secret keys, consider these essential practices:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Length and Complexity</h4>
                  <p className="text-gray-600 text-sm">
                    Use keys with at least 256 bits of entropy. Our generator offers options from 32 to 2048 bits for maximum security.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Randomness</h4>
                  <p className="text-gray-600 text-sm">
                    Ensure true randomness in key generation. Our tool uses cryptographically secure random number generators.
                  </p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Regular Rotation</h4>
                  <p className="text-gray-600 text-sm">
                    Change your secret keys periodically to limit the impact of potential compromises.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Storage</h4>
                  <p className="text-gray-600 text-sm">
                    Store secret keys in secure environments, using key management services or environment variables rather than hardcoding them.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Environment Separation</h4>
                  <p className="text-gray-600 text-sm">
                    Use different secret keys for development, testing, and production environments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Algorithm Selection
            </h2>
            <p className="text-gray-600 mb-6">
              JWT supports various signing algorithms, and the choice affects how the secret key is used:
            </p>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">HMAC</span>
                  HS256, HS384, HS512
                </h4>
                <p className="text-gray-600 text-sm">
                  Uses a single secret key for both signing and verification. Ideal for single-application scenarios where 
                  the same service issues and verifies tokens.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">RSA</span>
                  RS256, RS384, RS512
                </h4>
                <p className="text-gray-600 text-sm">
                  Uses a private key for signing and a public key for verification. Perfect for distributed systems where 
                  multiple services need to verify tokens.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">ECDSA</span>
                  ES256, ES384, ES512
                </h4>
                <p className="text-gray-600 text-sm">
                  Similar to RSA but uses elliptic curve cryptography for smaller key sizes with equivalent security. 
                  Offers better performance with the same security level.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Considerations */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Implementation Considerations
            </h2>
            <p className="text-gray-600 mb-6">
              When implementing JWT authentication with your generated secret key:
            </p>
            
            <ul className="list-disc pl-6 space-y-3 text-gray-600 mb-6">
              <li>Set appropriate token expiration times to limit the window of opportunity for token misuse</li>
              <li>Include only necessary claims in the payload to minimize token size</li>
              <li>Implement proper error handling for token validation failures</li>
              <li>Consider using a token blacklist or revocation mechanism for logout functionality</li>
              <li>Always validate tokens on the server side, never trust client-side validation alone</li>
              <li>Use HTTPS in production to prevent token interception during transmission</li>
            </ul>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Security Note
              </h4>
              <p className="text-gray-600 text-sm">
                By using our JWT Secret Key Generator, you&apos;re taking an important step toward implementing secure authentication 
                in your applications. The tool provides cryptographically strong keys that help protect your users&apos; data and 
                your system&apos;s integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Use Our JWT Secret Generator?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Cryptographically secure random generation</li>
                  <li>Customizable key length from 32 to 2048 bits</li>
                  <li>Instant generation with one click</li>
                  <li>Copy to clipboard functionality</li>
                  <li>No data stored or transmitted</li>
                  <li>Free to use with no registration required</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Features</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Uses browser&apos;s built-in cryptographic functions</li>
                  <li>High entropy random number generation</li>
                  <li>No server-side processing</li>
                  <li>Keys generated locally in your browser</li>
                  <li>Compatible with all major JWT libraries</li>
                  <li>Follows industry security standards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
