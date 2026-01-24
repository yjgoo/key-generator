'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import * as bcrypt from 'bcryptjs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { KeyGenerator } from '@/lib/keyGenerators';

interface BcryptGeneratorProps {
  generator: KeyGenerator;
}

export function BcryptGenerator({ generator }: BcryptGeneratorProps) {
  const [password, setPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

    const generateHash = useCallback(async () => {
    if (!password) {
        setHash('');
        return;
    }
    setIsGenerating(true);
    try {
        const newHash = await bcrypt.hash(password, rounds);
        setHash(newHash);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
        setCopied(false);
    }
    }, [password, rounds]);

  // Generate on mount with a random password
  useEffect(() => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setPassword(randomPassword);
  }, []);
  
  // Generate hash when password is set initially
    useEffect(() => {
      if (password) {
        generateHash();
      }
    }, [password, generateHash]);


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
            
            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="text"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter password to hash"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="rounds" className="block text-sm font-medium text-gray-700">
                        Salt Rounds (Cost Factor)
                    </label>
                    <input
                        type="number"
                        id="rounds"
                        value={rounds}
                        onChange={(e) => setRounds(parseInt(e.target.value) || 10)}
                        min="4"
                        max="31"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500">Higher rounds = slower hashing. Recommended: 10-12.</p>
                </div>
            </div>

            {/* Generated Key Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Bcrypt Hash</h3>
              <div className="relative">
                <textarea
                  value={hash}
                  readOnly
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hash will appear here..."
                />
                {hash && (
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
              onClick={generateHash}
              disabled={isGenerating}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? 'Generating...' : 'Generate Hash'}
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
              About Bcrypt Hash Generator
            </h2>
            <p className="text-gray-600 mb-6">
              Generate secure Bcrypt hashes for your passwords. Bcrypt is a password-hashing function designed by Niels Provos and David Mazières, based on the Blowfish cipher. It incorporates a salt to protect against rainbow table attacks and is an adaptive function: over time, the iteration count can be increased to make it slower, so it remains resistant to brute-force search attacks even with increasing computation power.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              How to use
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Enter the password you want to hash.</li>
              <li>Select the number of salt rounds (cost factor). Higher means slower and more secure.</li>
              <li>Click &quot;Generate Hash&quot;.</li>
              <li>Copy the resulting hash.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
