import { ensureSchema, getRows, sql } from '@/lib/db';

export type PostStatus = 'draft' | 'published';

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  summary: string | null;
  category_id: string | null;
  category_name: string | null;
  category_slug: string | null;
  cover_image_url: string | null;
  status: PostStatus;
  created_at: string;
  published_at: string | null;
  author_name: string | null;
}

export interface PostDetail extends PostSummary {
  content: string;
  updated_at: string;
}

export interface CommentItem {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string | null;
  content: string;
  created_at: string;
}

export interface RelatedToolItem {
  id: string;
  post_id: string;
  title: string;
  description: string | null;
  url: string;
  sort_order: number;
  created_at: string;
}

export async function listPublishedPosts() {
  await ensureSchema();
  const result = await sql`
    SELECT
      posts.id,
      posts.title,
      posts.slug,
      posts.excerpt,
      posts.summary,
        posts.category_id,
        categories.name as category_name,
        categories.slug as category_slug,
      posts.cover_image_url,
      posts.status,
      posts.created_at,
      posts.published_at,
      COALESCE(users.name, users.email) AS author_name
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    WHERE status = 'published'
    ORDER BY published_at DESC NULLS LAST, created_at DESC;
  `;

  return getRows(result) as PostSummary[];
}

export async function listAllPosts() {
  await ensureSchema();
  const result = await sql`
    SELECT
      posts.id,
      posts.title,
      posts.slug,
      posts.excerpt,
      posts.summary,
        posts.category_id,
        categories.name as category_name,
        categories.slug as category_slug,
      posts.cover_image_url,
      posts.status,
      posts.created_at,
      posts.published_at,
      COALESCE(users.name, users.email) AS author_name
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    ORDER BY created_at DESC;
  `;

  return getRows(result) as PostSummary[];
}

export async function getPostBySlug(slug: string) {
  await ensureSchema();
  const result = await sql`
    SELECT
      posts.id,
      posts.title,
      posts.slug,
      posts.excerpt,
      posts.summary,
      posts.category_id,
      categories.name as category_name,
      categories.slug as category_slug,
      posts.cover_image_url,
      posts.content,
      posts.status,
      posts.created_at,
      posts.updated_at,
      posts.published_at,
      COALESCE(users.name, users.email) AS author_name
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    WHERE slug = ${slug}
    LIMIT 1;
  `;

  return (getRows(result) as PostDetail[])[0] ?? null;
}

export async function getPublishedPostBySlug(slug: string) {
  await ensureSchema();
  const result = await sql`
    SELECT
      posts.id,
      posts.title,
      posts.slug,
      posts.excerpt,
      posts.summary,
      posts.category_id,
      categories.name as category_name,
      categories.slug as category_slug,
      posts.cover_image_url,
      posts.content,
      posts.status,
      posts.created_at,
      posts.updated_at,
      posts.published_at,
      COALESCE(users.name, users.email) AS author_name
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    WHERE slug = ${slug} AND status = 'published'
    LIMIT 1;
  `;

  return (getRows(result) as PostDetail[])[0] ?? null;
}

export async function listComments(postId: string) {
  await ensureSchema();
  const result = await sql`
    SELECT id, post_id, parent_id, author_name, author_email, content, created_at
    FROM comments
    WHERE post_id = ${postId}
    ORDER BY created_at ASC;
  `;

  return getRows(result) as CommentItem[];
}

export async function listRelatedTools(postId: string) {
  await ensureSchema();
  const result = await sql`
    SELECT id, post_id, title, description, url, sort_order, created_at
    FROM post_related_tools
    WHERE post_id = ${postId}
    ORDER BY sort_order ASC, created_at ASC;
  `;

  return getRows(result) as RelatedToolItem[];
}
