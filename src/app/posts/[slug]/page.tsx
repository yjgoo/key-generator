import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ShareSection } from '@/components/ShareSection';
import { AdSlot } from '@/components/AdSlot';
import { addCommentAction } from './actions';
import { getPublishedPostBySlug, listComments, listRelatedPostsByTags, listRelatedTools } from '@/lib/posts';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found - Key Generator',
      robots: { index: false, follow: false },
    };
  }

  const coverImageUrl = post.cover_image_url || undefined;

  return {
    title: `${post.title} - Key Generator`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      url: `https://key-generator.com/posts/${post.slug}`,
      images: coverImageUrl ? [{ url: coverImageUrl }] : undefined,
    },
    twitter: {
      card: coverImageUrl ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.excerpt || post.title,
      images: coverImageUrl ? [coverImageUrl] : undefined,
    },
    alternates: {
      canonical: `https://key-generator.com/posts/${post.slug}`,
    },
  };
}

function renderContent(content: string) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h1: ({ children, ...props }) => (
          <h1 className="mt-8 mb-4 text-3xl font-bold text-gray-900" {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900" {...props}>
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4 className="mt-6 mb-2 text-lg font-semibold text-gray-900" {...props}>
            {children}
          </h4>
        ),
        p: ({ children, ...props }) => (
          <p className="mb-4 text-gray-700 leading-7" {...props}>
            {children}
          </p>
        ),
        a: ({ children, href, ...props }) => {
          const isExternal = typeof href === 'string' && /^https?:\/\//i.test(href);
          return (
            <a
              href={href}
              className="text-blue-600 underline hover:text-blue-700"
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer noopener' : undefined}
              {...props}
            >
              {children}
            </a>
          );
        },
        ul: ({ children, ...props }) => (
          <ul className="mb-4 list-disc pl-6 text-gray-700" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="mb-4 list-decimal pl-6 text-gray-700" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li className="mb-2" {...props}>
            {children}
          </li>
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="my-6 border-l-4 border-blue-200 bg-blue-50 px-4 py-3 text-gray-700"
            {...props}
          >
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          const isBlock = typeof className === 'string' && className.length > 0;
          if (isBlock) {
            return (
              <code className="block overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100" {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-gray-800" {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children, ...props }) => (
          <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100" {...props}>
            {children}
          </pre>
        ),
        hr: (props) => <hr className="my-8 border-gray-200" {...props} />,
        img: ({ alt, src }) => {
          if (!src || typeof src !== 'string') {
            return null;
          }
          return (
            <Image
              src={src}
              alt={alt || ''}
              width={1200}
              height={630}
              sizes="(max-width: 768px) 100vw, 768px"
              className="my-6 h-auto w-full rounded-lg border border-gray-200"
              unoptimized
            />
          );
        },
        table: ({ children, ...props }) => (
          <div className="my-6 overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-gray-50 text-left text-gray-700" {...props}>
            {children}
          </thead>
        ),
        tbody: ({ children, ...props }) => (
          <tbody className="divide-y divide-gray-200" {...props}>
            {children}
          </tbody>
        ),
        th: ({ children, ...props }) => (
          <th className="px-3 py-2 font-semibold" {...props}>
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="px-3 py-2 text-gray-700" {...props}>
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [comments, relatedTools, relatedPosts] = await Promise.all([
    listComments(post.id),
    listRelatedTools(post.id),
    listRelatedPostsByTags(post.id),
  ]);
  const shareUrl = `https://key-generator.com/posts/${post.slug}`;
  const grouped = new Map<string | null, typeof comments>();

  comments.forEach((comment) => {
    const key = comment.parent_id ?? null;
    const list = grouped.get(key) ?? [];
    list.push(comment);
    grouped.set(key, list);
  });

  const renderComments = (parentId: string | null, depth = 0) => {
    const list = grouped.get(parentId) ?? [];
    if (list.length === 0) {
      return null;
    }

    return (
      <div className={depth === 0 ? 'space-y-6' : 'mt-4 space-y-4 border-l border-gray-200 pl-4'}>
        {list.map((comment) => (
          <div key={comment.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">{comment.author_name}</div>
              <div className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</div>
            </div>
            <p className="mt-2 text-gray-700 leading-6">{comment.content}</p>

            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-blue-600">Reply</summary>
              <form action={addCommentAction} className="mt-3 space-y-3">
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="parentId" value={comment.id} />
                <input type="hidden" name="slug" value={post.slug} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    name="authorName"
                    placeholder="Your name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    name="authorEmail"
                    placeholder="Email (optional)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  name="content"
                  rows={3}
                  required
                  placeholder="Write your reply"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Post reply
                </button>
              </form>
            </details>

            {renderComments(comment.id, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/posts" className="hover:text-gray-700">
                Articles
              </Link>
            </li>
            {post.category_name && (
              <>
                <li className="text-gray-400">/</li>
                <li>
                  <Link
                    href={`/posts?category=${encodeURIComponent(post.category_slug || '')}`}
                    className="hover:text-gray-700"
                  >
                    {post.category_name}
                  </Link>
                </li>
              </>
            )}
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 line-clamp-1" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            <article className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                {post.category_name && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {post.category_name}
                  </span>
                )}
                {post.tags.length > 0 &&
                  post.tags.map((tag) => (
                    <a
                      key={tag.id}
                      href={`/posts?tag=${encodeURIComponent(tag.slug)}`}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                    >
                      #{tag.name}
                    </a>
                  ))}
                <span>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : new Date(post.created_at).toLocaleDateString()}
                </span>
                {post.author_name && <span>• By {post.author_name}</span>}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{post.title}</h1>
              {post.excerpt && <p className="mt-3 text-gray-600">{post.excerpt}</p>}
              {post.cover_image_url && (
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <Image
                    src={post.cover_image_url}
                    alt={`${post.title} cover image`}
                    width={1200}
                    height={630}
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="h-auto w-full object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="mt-6">{renderContent(post.content)}</div>
            </article>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">Comments & Replies</h2>
              <div className="mt-6 space-y-6">
                {renderComments(null)}
                {comments.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
                    No comments yet. Be the first to comment.
                  </div>
                )}
              </div>

              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Leave a comment</h3>
                <form action={addCommentAction} className="mt-4 space-y-4">
                  <input type="hidden" name="postId" value={post.id} />
                  <input type="hidden" name="slug" value={post.slug} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="authorName"
                      placeholder="Your name"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      name="authorEmail"
                      placeholder="Email (optional)"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <textarea
                    name="content"
                    rows={4}
                    required
                    placeholder="Write your comment"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Post comment
                  </button>
                </form>
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            <ShareSection title={post.title} url={shareUrl} />
            <AdSlot placement="content-rectangle" />
            {relatedTools.length > 0 && (
              <section aria-labelledby="related-tools-title">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 id="related-tools-title" className="text-xl font-semibold text-gray-900">
                    Related Tools
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Helpful key generators mentioned in this article.
                  </p>
                  <ul className="mt-4 space-y-3">
                    {relatedTools.map((tool) => (
                      <li key={tool.id} className="rounded-lg border border-gray-200 p-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          <a href={tool.url} className="hover:text-blue-600">
                            {tool.title}
                          </a>
                        </h3>
                        {tool.description && (
                          <p className="mt-2 text-xs text-gray-600">{tool.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {relatedPosts.length > 0 && (
              <section aria-labelledby="related-posts-title">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 id="related-posts-title" className="text-xl font-semibold text-gray-900">
                    Related Articles
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Posts with overlapping tags you might find helpful.
                  </p>
                  <div className="mt-4 space-y-3">
                    {relatedPosts.map((related) => (
                      <a
                        key={related.id}
                        href={`/posts/${related.slug}`}
                        className="block rounded-lg border border-gray-200 p-3 hover:border-blue-200 hover:shadow-sm"
                      >
                        <div className="text-xs text-gray-500">
                          {related.published_at
                            ? new Date(related.published_at).toLocaleDateString()
                            : new Date(related.created_at).toLocaleDateString()}
                        </div>
                        <h3 className="mt-1 text-sm font-semibold text-gray-900">
                          {related.title}
                        </h3>
                        {(related.summary || related.excerpt) && (
                          <p className="mt-2 text-xs text-gray-600">
                            {related.summary || related.excerpt}
                          </p>
                        )}
                        {related.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {related.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag.id}
                                className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600"
                              >
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
