'use client';

import { useActionState, useMemo, useState } from 'react';
import { createPostAction, CreatePostState } from './actions';

const initialState: CreatePostState = {};

export function PostForm() {
  const [state, formAction, isPending] = useActionState(createPostAction, initialState);
  const [relatedTools, setRelatedTools] = useState<
    Array<{ title: string; url: string; description: string }>
  >([{ title: '', url: '', description: '' }]);

  const relatedToolsJson = useMemo(() => JSON.stringify(relatedTools), [relatedTools]);

  const updateTool = (index: number, field: 'title' | 'url' | 'description', value: string) => {
    setRelatedTools((current) =>
      current.map((tool, toolIndex) =>
        toolIndex === index ? { ...tool, [field]: value } : tool,
      ),
    );
  };

  const addTool = () => {
    setRelatedTools((current) => [...current, { title: '', url: '', description: '' }]);
  };

  const removeTool = (index: number) => {
    setRelatedTools((current) => current.filter((_, toolIndex) => toolIndex !== index));
  };

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

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Related tools</label>
          <p className="text-xs text-gray-500">
            Link key-generator tools that are relevant to this post. Add a short description for SEO.
          </p>
        </div>
        <input type="hidden" name="relatedTools" value={relatedToolsJson} />
        <div className="mt-4 space-y-4">
          {relatedTools.map((tool, index) => (
            <div key={`tool-${index}`} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600">Tool name</label>
                  <input
                    type="text"
                    value={tool.title}
                    onChange={(event) => updateTool(index, 'title', event.target.value)}
                    placeholder="e.g. Random JWT Secret Generator"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600">Tool URL</label>
                  <input
                    type="text"
                    value={tool.url}
                    onChange={(event) => updateTool(index, 'url', event.target.value)}
                    placeholder="/random-jwt-secret-generator"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-600">Short description</label>
                <input
                  type="text"
                  value={tool.description}
                  onChange={(event) => updateTool(index, 'description', event.target.value)}
                  placeholder="One sentence summary of what the tool helps with"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Optional but recommended for SEO.</span>
                {relatedTools.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTool(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTool}
          className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          + Add another tool
        </button>
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
