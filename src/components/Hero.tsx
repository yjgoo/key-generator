'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getPrimaryGenerator, generateKey, keyGenerators, getGeneratorPath } from '@/lib/keyGenerators';

export function Hero() {
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState(false);
  const primaryGenerator = getPrimaryGenerator();

  const generateNewKey = useCallback(() => {
    const newKey = generateKey(primaryGenerator.id);
    setGeneratedKey(newKey);
    setCopied(false);
  }, [primaryGenerator.id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate initial key on component mount
  useEffect(() => {
    generateNewKey();
  }, [generateNewKey]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Generate Secure
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Keys</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Create cryptographically secure keys, passwords, and tokens for your applications. 
          Fast, secure, and completely free.
        </p>

        <div id={primaryGenerator.id} className="bg-white rounded-2xl shadow-xl p-4 mb-6 max-w-2xl mx-auto">
          <div className="mb-3">
            <Link 
              href={getGeneratorPath(primaryGenerator.id)}
              className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors mb-1.5 text-left"
            >
              {primaryGenerator.title}
            </Link>
            <div className="relative">
              <input
                type="text"
                value={generatedKey}
                readOnly
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Generating..."
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          
          <button
            onClick={generateNewKey}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
          >
            🔄 Generate New Key
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-8">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Cryptographically Secure
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            No Data Stored
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Open Source
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Access</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1.5">
            {keyGenerators.map((generator) => (
              <Link
                key={generator.id}
                href={getGeneratorPath(generator.id)}
                className="group bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-md p-1.5 transition-all duration-200 text-center"
              >
                <div className="text-xs font-medium text-gray-700 group-hover:text-blue-600 truncate">
                  {generator.title
                    .replace(' Generator', '')
                    .replace('Random ', '')
                    .replace('Secure & Strong ', 'Secure ')
                    .replace('Next.js Auth Secret', 'Next.js Auth')
                    .replace('Secret Key', 'Key')
                    .replace('String', 'Str')
                    .replace('Alphanumeric', 'AlphaNum')
                    .replace('Address', 'Addr')
                  }
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
