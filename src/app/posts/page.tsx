import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { listPublishedPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Articles - Key Generator',
  description: 'Security tips, key management guides, and product updates from Key Generator.',
  openGraph: {
    title: 'Articles - Key Generator',
    description: 'Security tips, key management guides, and product updates from Key Generator.',
    type: 'website',
    url: 'https://key-generator.com/posts',
  },
  twitter: {
    card: 'summary',
    title: 'Articles - Key Generator',
    description: 'Security tips, key management guides, and product updates from Key Generator.',
  },
  alternates: {
    canonical: 'https://key-generator.com/posts',
  },
};

export default async function PostsPage() {
  const posts = await listPublishedPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-2">关于安全密钥与产品更新的文章。</p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="text-sm text-gray-500">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString()
                  : new Date(post.created_at).toLocaleDateString()}
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">{post.title}</h2>
              {post.excerpt && <p className="mt-3 text-gray-600">{post.excerpt}</p>}
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              还没有文章发布，稍后再来看看吧。
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
