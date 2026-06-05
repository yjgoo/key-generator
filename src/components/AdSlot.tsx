import Script from 'next/script';

type AdPlacement = 'inline-banner' | 'content-rectangle';

const ADS = {
  'inline-banner': {
    key: 'bb9f14d28ee91bb533468621fcdff0d5',
    width: 320,
    height: 50,
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
  const scriptId = `ad-options-${placement}`;

  return (
    <aside
      className={`mx-auto flex w-full justify-center overflow-hidden ${className}`}
      aria-label="Advertisement"
    >
      <div
        className="flex items-center justify-center"
        style={{ width: ad.width, minHeight: ad.height }}
      >
        <Script id={scriptId} strategy="afterInteractive">
          {`
            window.atOptions = {
              key: '${ad.key}',
              format: 'iframe',
              height: ${ad.height},
              width: ${ad.width},
              params: {}
            };
          `}
        </Script>
        <Script
          id={`ad-invoke-${placement}`}
          src={`https://www.highperformanceformat.com/${ad.key}/invoke.js`}
          strategy="afterInteractive"
        />
      </div>
    </aside>
  );
}
