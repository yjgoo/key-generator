'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StructuredData } from '@/components/StructuredData';
import { KeyGenerator, PasswordOptions, defaultPasswordOptions, generatePassword, getPasswordCharsetInfo } from '@/lib/keyGenerators';

interface RandomPasswordGeneratorClientProps {
  generator: KeyGenerator;
}

type StrengthLevel = {
  label: string;
  color: string;
  bgColor: string;
};

const getStrengthLevel = (entropy: number): StrengthLevel => {
  if (entropy < 40) {
    return { label: 'Weak', color: 'text-red-600', bgColor: 'bg-red-500' };
  }
  if (entropy < 60) {
    return { label: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-500' };
  }
  if (entropy < 80) {
    return { label: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
  }
  if (entropy < 100) {
    return { label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' };
  }
  return { label: 'Very Strong', color: 'text-emerald-600', bgColor: 'bg-emerald-500' };
};

export function RandomPasswordGeneratorClient({ generator }: RandomPasswordGeneratorClientProps) {
  const [options, setOptions] = useState<PasswordOptions>(defaultPasswordOptions);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | 'all' | null>(null);
  const [autoGenerate, setAutoGenerate] = useState(true);

  const charsetInfo = useMemo(() => getPasswordCharsetInfo(options), [options]);
  const entropy = useMemo(() => {
    const charsetSize = Math.max(1, charsetInfo.charsetSize);
    return options.length * Math.log2(charsetSize);
  }, [charsetInfo.charsetSize, options.length]);
  const strength = useMemo(() => getStrengthLevel(entropy), [entropy]);
  const strengthPercent = useMemo(() => Math.min(100, Math.round((entropy / 128) * 100)), [entropy]);

  const generatePasswords = useCallback(() => {
    try {
      const safeCount = Math.min(20, Math.max(1, count));
      const nextPasswords = Array.from({ length: safeCount }, () => generatePassword(options));
      setPasswords(nextPasswords);
      setError(null);
      setCopiedIndex(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate password.');
    }
  }, [count, options]);

  useEffect(() => {
    generatePasswords();
  }, [generatePasswords]);

  useEffect(() => {
    if (autoGenerate) {
      generatePasswords();
    }
  }, [autoGenerate, generatePasswords, options, count]);

  const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = async (value: string, index?: number | 'all') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index ?? null);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StructuredData generator={generator} pageUrl="https://key-generator.com/random-password-generator" />
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {generator.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate strong, customizable passwords with smart options like excluding similar characters, avoiding duplicates, and batch creation.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="length" className="text-sm font-medium text-gray-700">
                      Password Length
                    </label>
                    <span className="text-sm text-gray-500">{options.length} characters</span>
                  </div>
                  <input
                    id="length"
                    type="range"
                    min={6}
                    max={128}
                    value={options.length}
                    onChange={(e) => updateOption('length', parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((options.length - 6) / (128 - 6)) * 100}%, #e5e7eb ${((options.length - 6) / (128 - 6)) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="count" className="block text-sm font-medium text-gray-700">Batch Quantity</label>
                    <input
                      id="count"
                      type="number"
                      min={1}
                      max={20}
                      value={count}
                      onChange={(e) => setCount(Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Auto Generate</label>
                    <button
                      type="button"
                      onClick={() => setAutoGenerate(prev => !prev)}
                      className={`w-full px-3 py-2 rounded-md border transition-colors ${autoGenerate ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
                    >
                      {autoGenerate ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Character Sets</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'includeUppercase', label: 'Uppercase (A-Z)' },
                      { key: 'includeLowercase', label: 'Lowercase (a-z)' },
                      { key: 'includeNumbers', label: 'Numbers (0-9)' },
                      { key: 'includeSymbols', label: 'Symbols' },
                    ].map(option => (
                      <label key={option.key} className="flex items-center space-x-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={options[option.key as keyof PasswordOptions] as boolean}
                          onChange={(e) => updateOption(option.key as keyof PasswordOptions, e.target.checked as never)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Smart Rules</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'excludeSimilar', label: 'Exclude similar (O/0, l/1)' },
                      { key: 'excludeAmbiguous', label: 'Exclude ambiguous symbols' },
                      { key: 'noDuplicates', label: 'No repeated characters' },
                      { key: 'startWithLetter', label: 'Start with a letter' },
                    ].map(option => (
                      <label key={option.key} className="flex items-center space-x-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={options[option.key as keyof PasswordOptions] as boolean}
                          onChange={(e) => updateOption(option.key as keyof PasswordOptions, e.target.checked as never)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="customSymbols" className="block text-sm font-medium text-gray-700">
                    Custom Symbols
                  </label>
                  <input
                    id="customSymbols"
                    type="text"
                    value={options.customSymbols}
                    onChange={(e) => updateOption('customSymbols', e.target.value)}
                    disabled={!options.includeSymbols}
                    placeholder="Optional: e.g. !@#$"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Password Strength</h3>
                    <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full ${strength.bgColor}`}
                      style={{ width: `${strengthPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 flex flex-wrap gap-2">
                    <span>Entropy: {entropy.toFixed(1)} bits</span>
                    <span>Charset: {charsetInfo.charsetSize} chars</span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Generated Passwords</h3>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(passwords.join('\n'), 'all')}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {copiedIndex === 'all' ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {passwords.map((password, index) => (
                      <div key={`${password}-${index}`} className="relative">
                        <input
                          type="text"
                          value={password}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => copyToClipboard(password, index)}
                          className="absolute top-2.5 right-3 text-xs text-gray-500 hover:text-gray-700"
                        >
                          {copiedIndex === index ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generatePasswords}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Generate New Password{count > 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Best Practices</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Use at least 12-16 characters for most accounts.</li>
              <li>Mix uppercase, lowercase, numbers, and symbols to increase entropy.</li>
              <li>Avoid predictable patterns or reused passwords.</li>
              <li>Prefer unique passwords and store them in a password manager.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
