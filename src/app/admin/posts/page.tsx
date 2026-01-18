import Link from 'next/link';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSession } from '@/lib/auth';
import { listAllPosts } from '@/lib/posts';
import { deletePostAction, togglePublishAction } from './actions';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Posts Admin - Key Generator',
  description: 'Manage posts for Key Generator.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPostsPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/admin/login');
  }

  const posts = await listAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Posts 管理</h1>
            <p className="text-sm text-gray-600 mt-1">创建、发布和管理文章。</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + 新建文章
            </Link>
            <Link
              href="/admin/logout"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              退出登录
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">标题</th>
                <th className="px-6 py-3 text-left font-semibold">状态</th>
                <th className="px-6 py-3 text-left font-semibold">发布时间</th>
                <th className="px-6 py-3 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => {
                const isPublished = post.status === 'published';
                return (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-500">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {isPublished ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {post.published_at ? new Date(post.published_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          查看
                        </Link>
                        <form action={togglePublishAction}>
                          <input type="hidden" name="postId" value={post.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={isPublished ? 'draft' : 'published'}
                          />
                          <button
                            type="submit"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            {isPublished ? '下线' : '发布'}
                          </button>
                        </form>
                        <form action={deletePostAction}>
                          <input type="hidden" name="postId" value={post.id} />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-700"
                          >
                            删除
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    还没有文章，点击“新建文章”开始发布吧。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
