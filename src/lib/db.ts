import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

export const sql = neon(databaseUrl);

export type SqlResult<T> = T[] | { rows: T[] };

export const getRows = <T>(result: SqlResult<T>): T[] => {
  if (Array.isArray(result)) {
    return result;
  }
  return result.rows;
};

let schemaReady = false;

export async function ensureSchema() {
  if (schemaReady) {
    return;
  }

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'admin',
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      slug text UNIQUE NOT NULL,
      excerpt text,
      content text NOT NULL,
      status text NOT NULL DEFAULT 'draft',
      author_id uuid REFERENCES users(id) ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      published_at timestamptz
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
      author_name text NOT NULL,
      author_email text,
      content text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS post_related_tools (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text,
      url text NOT NULL,
      sort_order integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_posts_status_created_at ON posts(status, created_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_post_related_tools_post_id ON post_related_tools(post_id);`;

  schemaReady = true;
}
