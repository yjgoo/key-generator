'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { keyGenerators, KeyGenerator, generateKey } from '@/lib/keyGenerators';

interface GeneratorCardProps {
  generator: KeyGenerator;
}

// Function to get the URL slug for a generator
function getGeneratorSlug(generatorId: string): string {
  const slugMap: Record<string, string> = {
    'nextjs-auth': 'next-js-auth-secret-generator',
    'secure-key': 'secure-strong-secret-key-generator',
    'jwt-secret': 'random-jwt-secret-generator',
    'password': 'random-password-generator',
    'random-string': 'random-string-generator',
    'uuid': 'random-uuid-generator',
    'api-key': 'random-api-key-generator',
    'hex-color': 'random-hex-color-generator',
    'base64': 'random-base64-string-generator',
    'alphanumeric': 'random-alphanumeric-string-generator',
    'numeric': 'random-numeric-string-generator',
    'mac-address': 'random-mac-address-generator',
  };
  
  return slugMap[generatorId] || '';
}

function GeneratorCard({ generator }: GeneratorCardProps) {
  const [generatedValue, setGeneratedValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState(generator.defaultOptions || {});

  const generateValue = () => {
    const value = generateKey(generator.id, options);
    setGeneratedValue(value);
    setCopied(false);
  };

  // Auto-generate value on component mount
  useEffect(() => {
    generateValue();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOptionChange = (key: string, value: string) => {
    const newOptions = { ...options, [key]: parseInt(value) || value };
    setOptions(newOptions);
  };

  return (
    <div id={generator.id} className="bg-white rounded-2xl shadow-xl p-4 hover:shadow-2xl transition-shadow duration-200">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <Link 
            href={`/${getGeneratorSlug(generator.id)}`}
            className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            {generator.title}
          </Link>
          
          {/* Options */}
          {generator.defaultOptions && (
            <div className="flex items-center space-x-2">
              {Object.entries(generator.defaultOptions).map(([key, defaultValue]) => (
                <div key={key} className="flex items-center space-x-1">
                  <label className="text-xs text-gray-500 capitalize">{key}:</label>
                  {generator.id === 'jwt-secret' && key === 'length' ? (
                    <div className="flex flex-col items-center space-y-1">
                      <input
                        type="range"
                        min="8"
                        max="512"
                        step="8"
                        value={options[key] || defaultValue}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="text-xs text-gray-500">
                        {options[key] || defaultValue} chars ({((options[key] || defaultValue) * 4)} bits)
                      </span>
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={options[key] || defaultValue}
                      onChange={(e) => handleOptionChange(key, e.target.value)}
                      className="w-12 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="128"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-600 mb-3">{generator.description}</p>
        
        {/* Generated Value Display */}
        <div className="relative">
          <input
            type="text"
            value={generatedValue}
            readOnly
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Click generate to create..."
          />
          {generatedValue && (
            <div className="absolute right-2 top-2 flex items-center space-x-2">
              {/* Color preview for hex color generator */}
              {generator.id === 'hex-color' && (
                <div 
                  className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                  style={{ backgroundColor: generatedValue }}
                  title={`Color preview: ${generatedValue}`}
                ></div>
              )}
              <button
                onClick={copyToClipboard}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={generateValue}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
      >
        🔄 Generate New Key
      </button>
    </div>
  );
}

export function KeyGenerators() {
  // Skip the first generator as it's used in the hero section
  const generators = keyGenerators.slice(1);

  return (
    <section id="generators" className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Specialized Key Generators
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Choose from our collection of specialized generators for different use cases and requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {generators.map((generator) => (
            <GeneratorCard key={generator.id} generator={generator} />
          ))}
        </div>
      </div>
    </section>
  );
}
