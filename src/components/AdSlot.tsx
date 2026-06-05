'use client';

import { useEffect, useRef } from 'react';

type AdPlacement = 'inline-banner' | 'leaderboard' | 'content-rectangle';

const ADS = {
  'inline-banner': {
    key: 'bb9f14d28ee91bb533468621fcdff0d5',
    width: 320,
    height: 50,
  },
  leaderboard: {
    key: 'd864172e8380d745ec870730882a508b',
    width: 728,
    height: 90,
  },
  'content-rectangle': {
    key: '84c222d080ecc5b3e21d6b8d44156eb5',
    width: 300,
    height: 250,
  },
} satisfies Record<AdPlacement, { key: string; width: number; height: number }>;

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

export function AdSlot({ placement, className = '' }: AdSlotProps) {
  const ad = ADS[placement];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.innerHTML = '';

    const optionsScript = document.createElement('script');
    optionsScript.text = `
      atOptions = {
        key: '${ad.key}',
        format: 'iframe',
        height: ${ad.height},
        width: ${ad.width},
        params: {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.src = `https://www.highperformanceformat.com/${ad.key}/invoke.js`;
    invokeScript.async = true;

    container.appendChild(optionsScript);
    container.appendChild(invokeScript);

    return () => {
      container.innerHTML = '';
    };
  }, [ad.height, ad.key, ad.width]);

  return (
    <aside
      className={`mx-auto my-10 flex w-full justify-center overflow-hidden ${className}`}
      aria-label="Advertisement"
    >
      <div
        ref={containerRef}
        className="flex max-w-full items-center justify-center"
        style={{ width: ad.width, minHeight: ad.height }}
      />
    </aside>
  );
}
