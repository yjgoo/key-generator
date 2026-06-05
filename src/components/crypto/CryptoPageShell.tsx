'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';

interface CryptoPageShellProps {
  title: string;
  description: string;
  breadcrumbLabel?: string;
  children: ReactNode;
}

export function CryptoPageShell({
  title,
  description,
  breadcrumbLabel,
  children,
}: CryptoPageShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">Home</Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">
              {breadcrumbLabel || title}
            </li>
          </ol>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
          {children}
        </div>

        <AdSlot placement="content-rectangle" />
      </main>

      <Footer />
    </div>
  );
}
