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

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const posts = await listPublishedPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Articles</h1>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {post.cover_image_url && (
                <div className="relative aspect-[5/2] h-[272px] w-full overflow-hidden bg-gray-100">
                  <img
                    src={post.cover_image_url}
                    alt={`${post.title} cover image`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/80 sm:text-sm">
                      {post.category_name && (
                        <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
                          {post.category_name}
                        </span>
                      )}
                      <span>
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : new Date(post.created_at).toLocaleDateString()}
                      </span>
                      {post.author_name && <span>• By {post.author_name}</span>}
                    </div>
                    <h2 className="mt-1 text-xl font-semibold text-white drop-shadow sm:text-2xl">
                      {post.title}
                    </h2>
                  </div>
                </div>
              )}
              <div className="p-6">
                {!post.cover_image_url && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      {post.category_name && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                          {post.category_name}
                        </span>
                      )}
                      <span>
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : new Date(post.created_at).toLocaleDateString()}
                      </span>
                      {post.author_name && <span>• By {post.author_name}</span>}
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900">{post.title}</h2>
                  </>
                )}
                {(post.summary || post.excerpt) && (
                  <p className="mt-3 text-gray-600">{post.summary || post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              No articles yet. Check back soon.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
