/**
 * AdPlacements Component
 * Pre-configured ad placement components for strategic locations
 */

'use client';

import AdUnit from './AdUnit';
import { AD_PLACEMENTS, AD_SLOTS } from './adsense.config';

interface AdPlacementProps {
  className?: string;
}

/**
 * Header Leaderboard Ad (728x90)
 * Place below the main header navigation
 * Loads immediately (above fold)
 */
export function HeaderLeaderboardAd({ className = '' }: AdPlacementProps) {
  const config = AD_PLACEMENTS.headerLeaderboard;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="container mx-auto max-w-7xl px-4 py-2">
        <div className="mx-auto max-w-[728px]">
          <AdUnit
            slot={config.slot}
            format={config.format}
            responsive={config.responsive}
            lazyLoad={config.lazyLoad}
            minHeight={config.minHeight}
            className={config.className}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Sidebar Rectangle Ad (300x250)
 * Place in sidebar areas
 * Lazy loads by default
 */
export function SidebarRectangleAd({ className = '' }: AdPlacementProps) {
  const config = AD_PLACEMENTS.sidebarRectangle;

  return (
    <div
      className={`w-full rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50 ${className}`}
    >
      <AdUnit
        slot={config.slot}
        format={config.format}
        responsive={config.responsive}
        lazyLoad={config.lazyLoad}
        minHeight={config.minHeight}
        className={config.className}
      />
    </div>
  );
}

/**
 * In-Content Ad (Responsive/Fluid)
 * Place within article content
 * Best positioned after 2-3 paragraphs
 */
export function InContentAd({ className = '' }: AdPlacementProps) {
  const config = AD_PLACEMENTS.inContent;

  return (
    <div
      className={`my-8 overflow-hidden rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/30 ${className}`}
    >
      <AdUnit
        slot={config.slot}
        format={config.format}
        responsive={config.responsive}
        lazyLoad={config.lazyLoad}
        className={config.className}
      />
    </div>
  );
}

/**
 * Footer Horizontal Ad
 * Place above the main footer
 * Lazy loads by default
 */
export function FooterHorizontalAd({ className = '' }: AdPlacementProps) {
  const config = AD_PLACEMENTS.footerHorizontal;

  return (
    <div className={`w-full border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <AdUnit
          slot={config.slot}
          format={config.format}
          responsive={config.responsive}
          lazyLoad={config.lazyLoad}
          minHeight={config.minHeight}
          className={config.className}
        />
      </div>
    </div>
  );
}

/**
 * Multiplex Ad (Recommended Content Style)
 * Shows multiple ad units in a grid format
 * Best for end of articles or related content sections
 */
export function MultiplexAd({ className = '' }: AdPlacementProps) {
  const config = AD_PLACEMENTS.multiplex;

  return (
    <div
      className={`my-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Recommended
      </h3>
      <AdUnit
        slot={config.slot}
        format={config.format}
        responsive={config.responsive}
        lazyLoad={config.lazyLoad}
        minHeight={config.minHeight}
        className={config.className}
      />
    </div>
  );
}

/**
 * Custom Ad Slot
 * For creating custom ad placements with specific slots
 */
interface CustomAdProps extends AdPlacementProps {
  slot: keyof typeof AD_SLOTS;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  lazyLoad?: boolean;
  minHeight?: string;
}

export function CustomAd({
  slot,
  format = 'auto',
  responsive = true,
  lazyLoad = true,
  minHeight,
  className = '',
}: CustomAdProps) {
  return (
    <div className={`ad-custom ${className}`}>
      <AdUnit
        slot={AD_SLOTS[slot]}
        format={format}
        responsive={responsive}
        lazyLoad={lazyLoad}
        minHeight={minHeight}
      />
    </div>
  );
}

/**
 * Sticky Sidebar Ad
 * A sidebar ad that sticks to viewport when scrolling
 * Use sparingly - can be intrusive
 */
export function StickySidebarAd({ className = '' }: AdPlacementProps) {
  const config = AD_PLACEMENTS.sidebarRectangle;

  return (
    <div className={`sticky top-24 ${className}`}>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50">
        <AdUnit
          slot={config.slot}
          format={config.format}
          responsive={config.responsive}
          lazyLoad={config.lazyLoad}
          minHeight={config.minHeight}
          className={config.className}
        />
      </div>
    </div>
  );
}

// Re-export AdUnit for custom implementations
export { default as AdUnit } from './AdUnit';

// Re-export config for external access
export { AD_SLOTS, AD_PLACEMENTS, ADSENSE_CLIENT_ID, isAdsEnabled } from './adsense.config';
