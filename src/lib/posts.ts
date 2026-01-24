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
  tags: TagItem[];
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

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  post_count: number;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
}

export interface TagSummary extends TagItem {
  post_count: number;
}

export async function listPublishedPosts(categorySlug?: string, tagSlug?: string) {
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
      COALESCE(users.name, users.email) AS author_name,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', tags.id, 'name', tags.name, 'slug', tags.slug))
          FILTER (WHERE tags.id IS NOT NULL),
        '[]'
      ) AS tags
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    LEFT JOIN post_tags ON post_tags.post_id = posts.id
    LEFT JOIN tags ON tags.id = post_tags.tag_id
    WHERE posts.status = 'published'
      AND (${categorySlug || null}::text IS NULL OR categories.slug = ${categorySlug || null})
      AND (
        ${tagSlug || null}::text IS NULL
        OR EXISTS (
          SELECT 1
          FROM post_tags filter_post_tags
          JOIN tags filter_tags ON filter_tags.id = filter_post_tags.tag_id
          WHERE filter_post_tags.post_id = posts.id
            AND filter_tags.slug = ${tagSlug || null}
        )
      )
    GROUP BY
      posts.id,
      categories.name,
      categories.slug,
      users.name,
      users.email
    ORDER BY published_at DESC NULLS LAST, created_at DESC;
  `;

  return (getRows(result) as Array<PostSummary & { tags: TagItem[] | string }>).map((post) => ({
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : (JSON.parse(String(post.tags || '[]')) as TagItem[]),
  }));
}

export async function listPublishedCategories() {
  await ensureSchema();
  const result = await sql`
    SELECT
      categories.id,
      categories.name,
      categories.slug,
      COUNT(posts.id) as post_count
    FROM categories
    LEFT JOIN posts
      ON posts.category_id = categories.id
      AND posts.status = 'published'
    GROUP BY categories.id, categories.name, categories.slug
    HAVING COUNT(posts.id) > 0
    ORDER BY categories.name ASC;
  `;

  return (getRows(result) as Array<{ id: string; name: string; slug: string; post_count: string }>).map(
    (row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      post_count: Number(row.post_count),
    }),
  ) as CategorySummary[];
}

export async function listPublishedTags() {
  await ensureSchema();
  const result = await sql`
    SELECT
      tags.id,
      tags.name,
      tags.slug,
      COUNT(posts.id) as post_count
    FROM tags
    JOIN post_tags ON post_tags.tag_id = tags.id
    JOIN posts
      ON posts.id = post_tags.post_id
      AND posts.status = 'published'
    GROUP BY tags.id, tags.name, tags.slug
    HAVING COUNT(posts.id) > 0
    ORDER BY tags.name ASC;
  `;

  return (getRows(result) as Array<{ id: string; name: string; slug: string; post_count: string }>).map(
    (row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      post_count: Number(row.post_count),
    }),
  ) as TagSummary[];
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
      COALESCE(users.name, users.email) AS author_name,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', tags.id, 'name', tags.name, 'slug', tags.slug))
          FILTER (WHERE tags.id IS NOT NULL),
        '[]'
      ) AS tags
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    LEFT JOIN post_tags ON post_tags.post_id = posts.id
    LEFT JOIN tags ON tags.id = post_tags.tag_id
    GROUP BY
      posts.id,
      categories.name,
      categories.slug,
      users.name,
      users.email
    ORDER BY created_at DESC;
  `;

  return (getRows(result) as Array<PostSummary & { tags: TagItem[] | string }>).map((post) => ({
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : (JSON.parse(String(post.tags || '[]')) as TagItem[]),
  }));
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
      COALESCE(users.name, users.email) AS author_name,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', tags.id, 'name', tags.name, 'slug', tags.slug))
          FILTER (WHERE tags.id IS NOT NULL),
        '[]'
      ) AS tags
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    LEFT JOIN post_tags ON post_tags.post_id = posts.id
    LEFT JOIN tags ON tags.id = post_tags.tag_id
    WHERE posts.slug = ${slug}
    GROUP BY
      posts.id,
      categories.name,
      categories.slug,
      users.name,
      users.email
    LIMIT 1;
  `;

  const post = (getRows(result) as Array<PostDetail & { tags: TagItem[] | string }>)[0] ?? null;
  if (!post) {
    return null;
  }
  return {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : (JSON.parse(String(post.tags || '[]')) as TagItem[]),
  };
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
      COALESCE(users.name, users.email) AS author_name,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', tags.id, 'name', tags.name, 'slug', tags.slug))
          FILTER (WHERE tags.id IS NOT NULL),
        '[]'
      ) AS tags
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    LEFT JOIN post_tags ON post_tags.post_id = posts.id
    LEFT JOIN tags ON tags.id = post_tags.tag_id
    WHERE posts.slug = ${slug} AND posts.status = 'published'
    GROUP BY
      posts.id,
      categories.name,
      categories.slug,
      users.name,
      users.email
    LIMIT 1;
  `;

  const post = (getRows(result) as Array<PostDetail & { tags: TagItem[] | string }>)[0] ?? null;
  if (!post) {
    return null;
  }
  return {
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : (JSON.parse(String(post.tags || '[]')) as TagItem[]),
  };
}

export async function listRelatedPostsByTags(postId: string, limit = 4) {
  await ensureSchema();
  const result = await sql`
    WITH target_tags AS (
      SELECT tag_id
      FROM post_tags
      WHERE post_id = ${postId}
    )
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
      COALESCE(users.name, users.email) AS author_name,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', tags.id, 'name', tags.name, 'slug', tags.slug))
          FILTER (WHERE tags.id IS NOT NULL),
        '[]'
      ) AS tags,
      COUNT(DISTINCT post_tags.tag_id) AS match_count
    FROM posts
    LEFT JOIN users ON posts.author_id = users.id
    LEFT JOIN categories ON posts.category_id = categories.id
    LEFT JOIN post_tags ON post_tags.post_id = posts.id
    LEFT JOIN tags ON tags.id = post_tags.tag_id
    WHERE posts.status = 'published'
      AND posts.id <> ${postId}
      AND post_tags.tag_id IN (SELECT tag_id FROM target_tags)
    GROUP BY
      posts.id,
      categories.name,
      categories.slug,
      users.name,
      users.email
    ORDER BY match_count DESC, published_at DESC NULLS LAST, created_at DESC
    LIMIT ${limit};
  `;

  return (getRows(result) as Array<PostSummary & { tags: TagItem[] | string }>).map((post) => ({
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : (JSON.parse(String(post.tags || '[]')) as TagItem[]),
  }));
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
