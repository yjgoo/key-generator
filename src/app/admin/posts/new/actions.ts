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
    return { error: '标题和正文不能为空。' };
  }

  const baseSlug = slugifyText(String(formData.get('slug') || '') || title);
  if (!baseSlug) {
    return { error: '无法生成有效的 slug。' };
  }

  const existing = await sql<{ id: string }>`SELECT id FROM posts WHERE slug = ${baseSlug} LIMIT 1;`;
  const existingRows = getRows(existing);
  if (existingRows.length > 0) {
    return { error: '该 slug 已存在，请修改后再提交。' };
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
