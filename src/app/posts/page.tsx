import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { listPublishedCategories, listPublishedPosts, listPublishedTags } from '@/lib/posts';

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

type PostsPageProps = {
  searchParams?: Promise<{ category?: string | string[]; tag?: string | string[] }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const rawCategory = params?.category;
  const rawTag = params?.tag;
  const activeCategory = Array.isArray(rawCategory)
    ? (rawCategory[0] || '').trim()
    : (rawCategory || '').trim();
  const activeTag = Array.isArray(rawTag) ? (rawTag[0] || '').trim() : (rawTag || '').trim();
  const [posts, categories, tags] = await Promise.all([
    listPublishedPosts(activeCategory || undefined, activeTag || undefined),
    listPublishedCategories(),
    listPublishedTags(),
  ]);
  const activeCategoryName =
    categories.find((category) => category.slug === activeCategory)?.name || activeCategory;
  const activeTagName = tags.find((tag) => tag.slug === activeTag)?.name || activeTag;

  const buildPostsUrl = ({ category, tag }: { category?: string; tag?: string }) => {
    const search = new URLSearchParams();
    if (category) {
      search.set('category', category);
    }
    if (tag) {
      search.set('tag', tag);
    }
    const query = search.toString();
    return query ? `/posts?${query}` : '/posts';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Articles</h1>
              <p className="mt-2 text-sm text-gray-600">
                Browse security tips, key management guides, and product updates.
              </p>
            </div>
            {(activeCategory || activeTag) && (
              <div className="text-sm text-gray-500">
                Filtering by{' '}
                <span className="font-semibold text-gray-800">
                  {activeCategoryName || 'All'}
                  {activeTagName ? ` · ${activeTagName}` : ''}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={buildPostsUrl({})}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold transition ${
                activeCategory
                  ? 'border-gray-300 text-gray-600 hover:border-gray-400'
                  : 'border-blue-600 bg-blue-600 text-white'
              }`}
            >
              All
            </Link>
            {categories.map((category) => {
              const isActive = activeCategory === category.slug;
              return (
                <Link
                  key={category.id}
                  href={buildPostsUrl({ category: category.slug, tag: activeTag || undefined })}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold transition ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {category.name}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {category.post_count}
                  </span>
                </Link>
              );
            })}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tags</span>
              <Link
                href={buildPostsUrl({ category: activeCategory || undefined })}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  activeTag
                    ? 'border-gray-300 text-gray-600 hover:border-gray-400'
                    : 'border-blue-600 bg-blue-600 text-white'
                }`}
              >
                All tags
              </Link>
              {tags.map((tag) => {
                const isActive = activeTag === tag.slug;
                return (
                  <Link
                    key={tag.id}
                    href={buildPostsUrl({ category: activeCategory || undefined, tag: tag.slug })}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      isActive
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {tag.name}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag.post_count}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
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
                  <Image
                    src={post.cover_image_url}
                    alt={`${post.title} cover image`}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                    unoptimized
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
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={buildPostsUrl({ category: activeCategory || undefined, tag: tag.slug })}
                        className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              No articles found for this filter.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
