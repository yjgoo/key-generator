import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PostForm } from './PostForm';

export const metadata: Metadata = {
  title: 'New Post - Key Generator',
  description: 'Create a new post for Key Generator.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewPostPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">New post</h1>
          <p className="text-sm text-gray-600 mb-6">Write and publish a new article.</p>
          <PostForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
