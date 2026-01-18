'use client';

import { useActionState } from 'react';
import { createPostAction, CreatePostState } from './actions';

const initialState: CreatePostState = {};

export function PostForm() {
  const [state, formAction, isPending] = useActionState(createPostAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">标题</label>
        <input
          type="text"
          name="title"
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="请输入文章标题"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slug (可选)</label>
        <input
          type="text"
          name="slug"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="自动根据标题生成"
        />
        <p className="mt-1 text-xs text-gray-500">留空会自动使用标题生成 slug。</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">摘要 (可选)</label>
        <textarea
          name="excerpt"
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="简短介绍文章内容"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">正文</label>
        <textarea
          name="content"
          rows={12}
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="在这里撰写文章内容"
        />
        <p className="mt-1 text-xs text-gray-500">目前以纯文本展示，支持换行。</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">状态</label>
        <select
          name="status"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          defaultValue="draft"
        >
          <option value="draft">草稿</option>
          <option value="published">立即发布</option>
        </select>
      </div>

      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? '发布中...' : '保存文章'}
        </button>
      </div>
    </form>
  );
}
