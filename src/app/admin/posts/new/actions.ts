'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { ensureSchema, getRows, sql } from '@/lib/db';
import { slugifyText } from '@/lib/utils';

export type CreatePostState = {
  error?: string;
};

export async function createPostAction(_: CreatePostState, formData: FormData): Promise<CreatePostState> {
  await requireAdmin();
  await ensureSchema();

  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const excerpt = String(formData.get('excerpt') || '').trim();
  const status = String(formData.get('status') || 'draft') as 'draft' | 'published';

  if (!title || !content) {
    return { error: 'Title and content are required.' };
  }

  const baseSlug = slugifyText(String(formData.get('slug') || '') || title);
  if (!baseSlug) {
    return { error: 'Unable to generate a valid slug.' };
  }

  const existing = await sql`SELECT id FROM posts WHERE slug = ${baseSlug} LIMIT 1;`;
  const existingRows = getRows(existing) as { id: string }[];
  if (existingRows.length > 0) {
    return { error: 'That slug already exists. Please choose another.' };
  }

  const publishedAt = status === 'published' ? new Date().toISOString() : null;

  await sql`
    INSERT INTO posts (title, slug, excerpt, content, status, published_at)
    VALUES (${title}, ${baseSlug}, ${excerpt || null}, ${content}, ${status}, ${publishedAt});
  `;

  revalidatePath('/posts');
  revalidatePath('/admin/posts');
  redirect('/admin/posts');
}
