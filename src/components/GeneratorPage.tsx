'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StructuredData } from '@/components/StructuredData';
import { KeyGenerator, generateKey as generateKeyUtil } from '@/lib/keyGenerators';

interface GeneratorPageProps {
  generator: KeyGenerator;
  seoDescription: string;
  pageUrl?: string;
}

export function GeneratorPage({ generator, seoDescription, pageUrl }: GeneratorPageProps) {
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

  const getOptionValue = (key: string, defaultValue: number | string | boolean): number => {
    const value = options[key] || defaultValue;
    return typeof value === 'number' ? value : Number(value) || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {pageUrl && <StructuredData generator={generator} pageUrl={pageUrl} />}
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
            {generator.description}
          </p>
        </div>

        {/* Generator Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="space-y-6">
            {/* Options */}
            {generator.defaultOptions && Object.keys(generator.defaultOptions).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(generator.defaultOptions).map(([key, defaultValue]) => (
                    <div key={key} className="space-y-2">
                      <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                        {generator.id === 'jwt-secret' && key === 'length' && (
                          <span className="ml-2 text-gray-500 text-xs">
                            ({getOptionValue(key, defaultValue)} characters = {getOptionValue(key, defaultValue) * 4} bits)
                          </span>
                        )}
                      </label>
                      {generator.id === 'jwt-secret' && key === 'length' ? (
                        <div className="space-y-2">
                          <input
                            type="range"
                            id={key}
                            min="8"
                            max="512"
                            step="8"
                            value={getOptionValue(key, defaultValue)}
                            onChange={(e) => handleOptionChange(key, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(getOptionValue(key, defaultValue) - 8) / (512 - 8) * 100}%, #e5e7eb ${(getOptionValue(key, defaultValue) - 8) / (512 - 8) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>8 chars (32 bits)</span>
                            <span>512 chars (2048 bits)</span>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="number"
                          id={key}
                          value={getOptionValue(key, defaultValue)}
                          onChange={(e) => handleOptionChange(key, parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                          max="1024"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Key Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated {generator.title}</h3>
              <div className="relative">
                <textarea
                  value={generatedKey}
                  readOnly
                  rows={generatedKey.length > 80 ? 4 : 2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Click generate to create a new key..."
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
              Generate New {generator.title}
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

        {/* SEO Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About {generator.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {seoDescription}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Why Use Our {generator.title} Generator?
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Cryptographically secure random generation</li>
              <li>Instant generation with one click</li>
              <li>Copy to clipboard functionality</li>
              <li>No data stored or transmitted</li>
              <li>Works entirely in your browser</li>
              <li>Free to use with no registration required</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              Security Features
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Uses browser&apos;s built-in cryptographic functions</li>
              <li>High entropy random number generation</li>
              <li>No server-side processing</li>
              <li>Keys generated locally in your browser</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
