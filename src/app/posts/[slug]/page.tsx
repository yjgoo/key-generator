import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { addCommentAction } from './actions';
import { getPublishedPostBySlug, listComments, listRelatedTools } from '@/lib/posts';

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
        code: ({ className, inline, children, ...props }) => {
          const isBlock = !inline;
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
        img: ({ alt, ...props }) => (
          <img
            alt={alt || ''}
            className="my-6 h-auto w-full rounded-lg border border-gray-200"
            loading="lazy"
            {...props}
          />
        ),
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

  const [comments, relatedTools] = await Promise.all([
    listComments(post.id),
    listRelatedTools(post.id),
  ]);
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
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
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{post.title}</h1>
          {post.excerpt && <p className="mt-3 text-gray-600">{post.excerpt}</p>}
          {post.cover_image_url && (
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <img
                src={post.cover_image_url}
                alt={`${post.title} cover image`}
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="mt-6">{renderContent(post.content)}</div>
        </article>

        {relatedTools.length > 0 && (
          <section className="mt-10" aria-labelledby="related-tools-title">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 id="related-tools-title" className="text-2xl font-semibold text-gray-900">
                Related Tools
              </h2>
              <p className="mt-2 text-gray-600">
                Helpful key generators mentioned in this article.
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedTools.map((tool) => (
                  <li key={tool.id} className="rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <a href={tool.url} className="hover:text-blue-600">
                        {tool.title}
                      </a>
                    </h3>
                    {tool.description && (
                      <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="mt-10">
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
      </main>
      <Footer />
    </div>
  );
}
