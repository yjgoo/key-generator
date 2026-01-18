'use server';

import { redirect } from 'next/navigation';
import { authenticateAdmin, createSession, setSessionCookie } from '@/lib/auth';

export type LoginState = {
  error?: string;
};

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const nextPath = String(formData.get('next') || '').trim();

  if (!email || !password) {
    return { error: 'Please enter your email and password.' };
  }

  const user = await authenticateAdmin(email, password);
  if (!user || user.role !== 'admin') {
    return { error: 'Invalid email or password.' };
  }

  const token = await createSession({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  await setSessionCookie(token);
  if (nextPath && nextPath.startsWith('/')) {
    redirect(nextPath);
  }
  redirect('/admin/posts');
}
