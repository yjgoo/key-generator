import { clearSessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLogoutPage() {
  await clearSessionCookie();
  redirect('/admin/login');
}
