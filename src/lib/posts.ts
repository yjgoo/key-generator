import { ensureSchema, getRows, sql } from '@/lib/db';

export type PostStatus = 'draft' | 'published';

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: PostStatus;
  created_at: string;
  published_at: string | null;
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
    SELECT id, title, slug, excerpt, status, created_at, published_at
    FROM posts
    WHERE status = 'published'
    ORDER BY published_at DESC NULLS LAST, created_at DESC;
  `;

  return getRows(result) as PostSummary[];
}

export async function listAllPosts() {
  await ensureSchema();
  const result = await sql`
    SELECT id, title, slug, excerpt, status, created_at, published_at
    FROM posts
    ORDER BY created_at DESC;
  `;

  return getRows(result) as PostSummary[];
}

export async function getPostBySlug(slug: string) {
  await ensureSchema();
  const result = await sql`
    SELECT id, title, slug, excerpt, content, status, created_at, updated_at, published_at
    FROM posts
    WHERE slug = ${slug}
    LIMIT 1;
  `;

  return (getRows(result) as PostDetail[])[0] ?? null;
}

export async function getPublishedPostBySlug(slug: string) {
  await ensureSchema();
  const result = await sql`
    SELECT id, title, slug, excerpt, content, status, created_at, updated_at, published_at
    FROM posts
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
