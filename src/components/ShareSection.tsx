'use client';

import { useState } from 'react';

type ShareSectionProps = {
  title: string;
  url: string;
};

export function ShareSection({ title, url }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors.
    }
  };

  return (
    <section aria-labelledby="share-title">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 id="share-title" className="text-xl font-semibold text-gray-900">
          Share
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Share this article on your favorite social platform.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <input
            type="text"
            value={url}
            readOnly
            className="w-full bg-transparent text-xs text-gray-600 outline-none"
            aria-label="Share link"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Copy
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(
              url,
            )}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600"
            aria-label="Share on X"
          >
            X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600"
            aria-label="Share on Facebook"
          >
            Facebook
          </a>
          {copied && <span className="text-xs text-green-600">Link copied</span>}
        </div>
      </div>
    </section>
  );
}
