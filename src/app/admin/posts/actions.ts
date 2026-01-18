'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { ensureSchema, sql } from '@/lib/db';

export async function togglePublishAction(formData: FormData) {
  await requireAdmin();
  await ensureSchema();

  const postId = String(formData.get('postId') || '');
  const nextStatus = String(formData.get('status') || 'draft');

  if (!postId) {
    return;
  }

  const publishedAt = nextStatus === 'published' ? new Date().toISOString() : null;

  await sql`
    UPDATE posts
    SET status = ${nextStatus},
        published_at = ${publishedAt},
        updated_at = now()
    WHERE id = ${postId};
  `;

  revalidatePath('/posts');
  revalidatePath('/admin/posts');
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  await ensureSchema();

  const postId = String(formData.get('postId') || '');
  if (!postId) {
    return;
  }

  await sql`DELETE FROM posts WHERE id = ${postId};`;

  revalidatePath('/posts');
  revalidatePath('/admin/posts');
}
