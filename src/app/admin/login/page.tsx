import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login - Key Generator',
  description: 'Admin login for Key Generator posts management.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const nextPath = resolvedSearchParams?.next;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Sign In</h1>
          <p className="text-sm text-gray-600 mb-6">Sign in with your admin account to publish articles.</p>
          <LoginForm nextPath={nextPath} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
