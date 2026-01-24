'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { keyGenerators } from '@/lib/keyGenerators';

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCryptoDropdownOpen, setIsCryptoDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cryptoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleGeneratorClick = (generatorId: string) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Create slug from generator ID
    const slugMap: Record<string, string> = {
      'nextjs-auth': 'next-js-auth-secret-generator',
      'secure-key': 'secure-strong-secret-key-generator',
      'jwt-secret-key': 'random-jwt-secret-key-generator',
      'password': 'random-password-generator',
      'bcrypt': 'bcrypt-hash-generator',
      'random-string': 'random-string-generator',
      'uuid': 'random-uuid-generator',
      'api-key': 'random-api-key-generator',
      'hex-color': 'random-hex-color-generator',
      'base64': 'random-base64-string-generator',
      'alphanumeric': 'random-alphanumeric-string-generator',
      'numeric': 'random-numeric-string-generator',
      'mac-address': 'random-mac-address-generator',
    };

    const slug = slugMap[generatorId];
    if (slug) {
      window.location.href = `/${slug}`;
    }
  };

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a delay before closing the dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150); // 150ms delay
  };

  const handleCryptoMouseEnter = () => {
    if (cryptoCloseTimeoutRef.current) {
      clearTimeout(cryptoCloseTimeoutRef.current);
      cryptoCloseTimeoutRef.current = null;
    }
    setIsCryptoDropdownOpen(true);
  };

  const handleCryptoMouseLeave = () => {
    cryptoCloseTimeoutRef.current = setTimeout(() => {
      setIsCryptoDropdownOpen(false);
    }, 150);
  };

  // Handle clicks outside the mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        // Check if the click is on the mobile menu button
        const mobileButton = document.querySelector('[data-mobile-menu-button]');
        if (mobileButton && !mobileButton.contains(event.target as Node)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clean up timeout on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (cryptoCloseTimeoutRef.current) {
        clearTimeout(cryptoCloseTimeoutRef.current);
      }
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Key Generator Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">Key Generator</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/posts" className="text-gray-600 hover:text-gray-900 transition-colors">
              Articles
            </Link>
            {/* Generators Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
              >
                <span>Generators</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="max-h-96 overflow-y-auto">
                    {keyGenerators.map((generator) => (
                      <button
                        key={generator.id}
                        onClick={() => handleGeneratorClick(generator.id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <div className="font-medium">{generator.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate">{generator.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cryptography Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleCryptoMouseEnter}
              onMouseLeave={handleCryptoMouseLeave}
            >
              <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1">
                <span>Cryptography</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isCryptoDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCryptoDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseEnter={handleCryptoMouseEnter}
                  onMouseLeave={handleCryptoMouseLeave}
                >
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">RSA</div>
                  <Link href="/cryptography/rsa/key-generator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    RSA Key Generator
                  </Link>
                  <Link href="/cryptography/rsa/sign" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    RSA Sign
                  </Link>
                  <Link href="/cryptography/rsa/verify" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    RSA Verify
                  </Link>
                  <Link href="/cryptography/rsa/encryption" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    RSA Encryption
                  </Link>
                  <Link href="/cryptography/rsa/decryption" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    RSA Decryption
                  </Link>

                  <div className="mt-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase">AES</div>
                  <Link href="/cryptography/aes/encryption" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    AES Encryption
                  </Link>
                  <Link href="/cryptography/aes/decryption" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    AES Decryption
                  </Link>

                  <div className="mt-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase">DES</div>
                  <Link href="/cryptography/des/encryption" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    DES Encryption
                  </Link>
                  <Link href="/cryptography/des/decryption" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    DES Decryption
                  </Link>
                </div>
              )}
            </div>

            <Link href="/#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            data-mobile-menu-button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden border-t border-gray-200 py-4">
            <Link
              href="/posts"
              className="block px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Articles
            </Link>
            <div className="space-y-4">
              {/* Mobile Generators List */}
              <div>
                <div className="text-gray-900 font-medium mb-2 px-4">Generators</div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {keyGenerators.map((generator) => (
                    <button
                      key={generator.id}
                      onClick={() => handleGeneratorClick(generator.id)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <div className="font-medium">{generator.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{generator.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-gray-900 font-medium mb-2 px-4">Cryptography</div>
                <div className="space-y-1">
                  <div className="px-4 pt-2 text-xs font-semibold text-gray-500 uppercase">RSA</div>
                  <Link
                    href="/cryptography/rsa/key-generator"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    RSA Key Generator
                  </Link>
                  <Link
                    href="/cryptography/rsa/sign"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    RSA Sign
                  </Link>
                  <Link
                    href="/cryptography/rsa/verify"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    RSA Verify
                  </Link>
                  <Link
                    href="/cryptography/rsa/encryption"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    RSA Encryption
                  </Link>
                  <Link
                    href="/cryptography/rsa/decryption"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    RSA Decryption
                  </Link>

                  <div className="px-4 pt-3 text-xs font-semibold text-gray-500 uppercase">AES</div>
                  <Link
                    href="/cryptography/aes/encryption"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    AES Encryption
                  </Link>
                  <Link
                    href="/cryptography/aes/decryption"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    AES Decryption
                  </Link>

                  <div className="px-4 pt-3 text-xs font-semibold text-gray-500 uppercase">DES</div>
                  <Link
                    href="/cryptography/des/encryption"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    DES Encryption
                  </Link>
                  <Link
                    href="/cryptography/des/decryption"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    DES Decryption
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  href="#about"
                  className="block px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>

                <Link
                  href="#faq"
                  className="block px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
