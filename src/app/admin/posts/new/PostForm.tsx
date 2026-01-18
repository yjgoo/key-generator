'use client';

import { useActionState } from 'react';
import { createPostAction, CreatePostState } from './actions';

const initialState: CreatePostState = {};

export function PostForm() {
  const [state, formAction, isPending] = useActionState(createPostAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter a post title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slug (optional)</label>
        <input
          type="text"
          name="slug"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Auto-generated from the title"
        />
        <p className="mt-1 text-xs text-gray-500">Leave empty to generate from the title.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Excerpt (optional)</label>
        <textarea
          name="excerpt"
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Brief summary of the post"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          name="content"
          rows={12}
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Write your post content here"
        />
        <p className="mt-1 text-xs text-gray-500">Content is displayed as plain text with line breaks.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          defaultValue="draft"
        >
          <option value="draft">Draft</option>
          <option value="published">Publish now</option>
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
          {isPending ? 'Saving...' : 'Save post'}
        </button>
      </div>
    </form>
  );
}
