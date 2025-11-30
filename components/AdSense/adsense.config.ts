/**
 * Google AdSense Configuration
 *
 * Configure ad placements and settings for the site.
 * Replace placeholder client ID and slots with real values from AdSense.
 */

// AdSense Publisher ID (replace with your actual ID)
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXX';

// Ad slot IDs for different placements
export const AD_SLOTS = {
  // Leaderboard ad below header (728x90)
  HEADER_LEADERBOARD: process.env.NEXT_PUBLIC_AD_SLOT_HEADER || '1234567890',

  // Medium rectangle for sidebar (300x250)
  SIDEBAR_RECTANGLE: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || '2345678901',

  // Responsive in-content ad
  IN_CONTENT: process.env.NEXT_PUBLIC_AD_SLOT_CONTENT || '3456789012',

  // Horizontal footer ad
  FOOTER_HORIZONTAL: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || '4567890123',

  // Multiplex ad (recommended content style)
  MULTIPLEX: process.env.NEXT_PUBLIC_AD_SLOT_MULTIPLEX || '5678901234',
} as const;

// Ad format types
export type AdFormat = 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';

// Ad placement configuration
export interface AdPlacementConfig {
  slot: string;
  format: AdFormat;
  responsive: boolean;
  lazyLoad: boolean;
  minHeight?: string;
  className?: string;
}

// Predefined ad placement configurations
export const AD_PLACEMENTS: Record<string, AdPlacementConfig> = {
  headerLeaderboard: {
    slot: AD_SLOTS.HEADER_LEADERBOARD,
    format: 'horizontal',
    responsive: true,
    lazyLoad: false, // Load immediately for above-fold
    minHeight: '90px',
    className: 'ad-header-leaderboard',
  },
  sidebarRectangle: {
    slot: AD_SLOTS.SIDEBAR_RECTANGLE,
    format: 'rectangle',
    responsive: true,
    lazyLoad: true,
    minHeight: '250px',
    className: 'ad-sidebar-rectangle',
  },
  inContent: {
    slot: AD_SLOTS.IN_CONTENT,
    format: 'fluid',
    responsive: true,
    lazyLoad: true,
    className: 'ad-in-content',
  },
  footerHorizontal: {
    slot: AD_SLOTS.FOOTER_HORIZONTAL,
    format: 'horizontal',
    responsive: true,
    lazyLoad: true,
    minHeight: '90px',
    className: 'ad-footer-horizontal',
  },
  multiplex: {
    slot: AD_SLOTS.MULTIPLEX,
    format: 'auto',
    responsive: true,
    lazyLoad: true,
    minHeight: '200px',
    className: 'ad-multiplex',
  },
};

// Lazy loading configuration
export const LAZY_LOAD_CONFIG = {
  // Root margin for intersection observer (load ads before they enter viewport)
  rootMargin: '200px 0px',
  // Visibility threshold to trigger load
  threshold: 0.01,
};

// Development mode check - don't show ads in development
export const isAdsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check if client ID is configured (not placeholder)
  const hasValidClientId = ADSENSE_CLIENT_ID && !ADSENSE_CLIENT_ID.includes('XXXXXXXXXX');

  // Check if in production or explicitly enabled
  const isProduction = process.env.NODE_ENV === 'production';
  const forceAds = process.env.NEXT_PUBLIC_FORCE_ADS === 'true';

  return hasValidClientId && (isProduction || forceAds);
};
