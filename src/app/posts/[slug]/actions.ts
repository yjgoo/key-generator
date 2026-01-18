'use server';

import { revalidatePath } from 'next/cache';
import { ensureSchema, sql } from '@/lib/db';

export async function addCommentAction(formData: FormData) {
  await ensureSchema();

  const postId = String(formData.get('postId') || '');
  const parentId = String(formData.get('parentId') || '').trim();
  const authorName = String(formData.get('authorName') || '').trim();
  const authorEmail = String(formData.get('authorEmail') || '').trim();
  const content = String(formData.get('content') || '').trim();

  if (!postId || !authorName || !content) {
    return;
  }

  await sql`
    INSERT INTO comments (post_id, parent_id, author_name, author_email, content)
    VALUES (${postId}, ${parentId || null}, ${authorName}, ${authorEmail || null}, ${content});
  `;

  revalidatePath(`/posts/${formData.get('slug') || ''}`);
}
