/**
 * Umami Analytics Tracking Library
 * Enhanced analytics configuration for kdptoolkit.com
 *
 * Provides type-safe tracking functions for:
 * - Page views
 * - Custom events (affiliate clicks, calculator usage, etc.)
 * - User engagement metrics
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Custom event types tracked by the application
 */
export type AnalyticsEventType =
  | 'affiliate_click'
  | 'calculator_use'
  | 'newsletter_signup'
  | 'guide_download'
  | 'tool_comparison'
  | 'search_query'
  | 'cta_click'
  | 'share_click'
  | 'scroll_depth'
  | 'time_on_page';

/**
 * Event data structure for custom events
 */
export interface AnalyticsEventData {
  // Common fields
  category?: string;
  label?: string;
  value?: number;

  // Affiliate-specific
  programId?: string;
  productName?: string;
  linkUrl?: string;

  // Calculator-specific
  calculatorType?: string;
  inputValues?: Record<string, string | number>;
  result?: string | number;

  // Newsletter-specific
  formLocation?: string;
  listId?: string;

  // Guide-specific
  guideSlug?: string;
  guideTitle?: string;
  format?: string;

  // Engagement-specific
  scrollPercentage?: number;
  timeSpentSeconds?: number;

  // Generic custom data
  [key: string]: string | number | boolean | Record<string, string | number> | undefined;
}

/**
 * Page view tracking options
 */
export interface PageViewOptions {
  url?: string;
  referrer?: string;
  title?: string;
}

/**
 * Umami tracker interface (loaded via script tag)
 */
interface UmamiTracker {
  track: (eventName: string, eventData?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Analytics configuration from environment variables
 */
export const analyticsConfig = {
  websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '',
  umamiUrl: process.env.NEXT_PUBLIC_UMAMI_URL || '',
  enabled: !!(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && process.env.NEXT_PUBLIC_UMAMI_URL),
  debug: process.env.NODE_ENV === 'development',
};

// ============================================================================
// Core Tracking Functions
// ============================================================================

/**
 * Check if Umami is loaded and available
 */
export function isUmamiAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.umami;
}

/**
 * Track a page view
 * Note: Umami auto-tracks page views, but this can be used for SPAs or custom tracking
 */
export function trackPageView(options?: PageViewOptions): void {
  if (!analyticsConfig.enabled || typeof window === 'undefined') {
    if (analyticsConfig.debug) {
      console.log('[Analytics] Page view (disabled):', options);
    }
    return;
  }

  if (!isUmamiAvailable()) {
    if (analyticsConfig.debug) {
      console.log('[Analytics] Umami not loaded yet');
    }
    return;
  }

  // Umami auto-tracks, but we can manually track for SPA navigation
  const eventData: Record<string, string> = {};
  if (options?.url) eventData.url = options.url;
  if (options?.referrer) eventData.referrer = options.referrer;
  if (options?.title) eventData.title = options.title;

  window.umami?.track('pageview', Object.keys(eventData).length > 0 ? eventData : undefined);

  if (analyticsConfig.debug) {
    console.log('[Analytics] Page view tracked:', eventData);
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventType: AnalyticsEventType,
  eventData?: AnalyticsEventData
): void {
  if (!analyticsConfig.enabled || typeof window === 'undefined') {
    if (analyticsConfig.debug) {
      console.log(`[Analytics] Event (disabled): ${eventType}`, eventData);
    }
    return;
  }

  if (!isUmamiAvailable()) {
    if (analyticsConfig.debug) {
      console.log('[Analytics] Umami not loaded yet');
    }
    return;
  }

  // Flatten nested objects for Umami compatibility
  const flattenedData: Record<string, string | number | boolean> = {};
  if (eventData) {
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null) {
          // Convert objects to JSON strings
          flattenedData[key] = JSON.stringify(value);
        } else {
          flattenedData[key] = value;
        }
      }
    });
  }

  window.umami?.track(eventType, flattenedData);

  if (analyticsConfig.debug) {
    console.log(`[Analytics] Event tracked: ${eventType}`, flattenedData);
  }
}

// ============================================================================
// Specialized Tracking Functions
// ============================================================================

/**
 * Track affiliate link click
 */
export function trackAffiliateClick(
  programId: string,
  productName: string,
  linkUrl: string,
  category?: string
): void {
  trackEvent('affiliate_click', {
    programId,
    productName,
    linkUrl,
    category,
    label: `${programId}:${productName}`,
  });
}

/**
 * Track calculator usage
 */
export function trackCalculatorUse(
  calculatorType: string,
  inputValues: Record<string, string | number>,
  result: string | number
): void {
  trackEvent('calculator_use', {
    calculatorType,
    inputValues,
    result,
    label: calculatorType,
    value: typeof result === 'number' ? result : undefined,
  });
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(
  formLocation: string,
  listId?: string
): void {
  trackEvent('newsletter_signup', {
    formLocation,
    listId,
    label: formLocation,
  });
}

/**
 * Track guide download
 */
export function trackGuideDownload(
  guideSlug: string,
  guideTitle: string,
  format: string = 'pdf'
): void {
  trackEvent('guide_download', {
    guideSlug,
    guideTitle,
    format,
    label: `${guideSlug}:${format}`,
  });
}

/**
 * Track tool comparison view
 */
export function trackToolComparison(
  tools: string[],
  category: string
): void {
  trackEvent('tool_comparison', {
    category,
    label: tools.join(' vs '),
    value: tools.length,
  });
}

/**
 * Track search query
 */
export function trackSearchQuery(
  query: string,
  resultsCount: number,
  category?: string
): void {
  trackEvent('search_query', {
    label: query,
    value: resultsCount,
    category,
  });
}

/**
 * Track CTA button click
 */
export function trackCtaClick(
  ctaName: string,
  location: string,
  destination?: string
): void {
  trackEvent('cta_click', {
    label: ctaName,
    category: location,
    linkUrl: destination,
  });
}

/**
 * Track social share click
 */
export function trackShareClick(
  platform: string,
  contentUrl: string,
  contentTitle?: string
): void {
  trackEvent('share_click', {
    label: platform,
    linkUrl: contentUrl,
    category: contentTitle,
  });
}

/**
 * Track scroll depth milestone
 */
export function trackScrollDepth(percentage: number): void {
  // Only track at key milestones (25%, 50%, 75%, 100%)
  const milestone = Math.floor(percentage / 25) * 25;
  if (milestone > 0 && milestone <= 100) {
    trackEvent('scroll_depth', {
      scrollPercentage: milestone,
      value: milestone,
      label: `${milestone}%`,
    });
  }
}

/**
 * Track time spent on page
 */
export function trackTimeOnPage(seconds: number): void {
  // Track at meaningful intervals (30s, 60s, 120s, 300s)
  const milestones = [30, 60, 120, 300];
  const milestone = milestones.find(m => seconds >= m && seconds < m + 30);

  if (milestone) {
    trackEvent('time_on_page', {
      timeSpentSeconds: milestone,
      value: milestone,
      label: `${milestone}s`,
    });
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a click handler that tracks an event before navigation
 */
export function createTrackedClickHandler(
  eventType: AnalyticsEventType,
  eventData: AnalyticsEventData,
  callback?: () => void
): () => void {
  return () => {
    trackEvent(eventType, eventData);
    if (callback) {
      callback();
    }
  };
}

/**
 * Wait for Umami to be available (useful for immediate tracking needs)
 */
export function waitForUmami(timeout: number = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (isUmamiAvailable()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isUmamiAvailable()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
}

/**
 * Get analytics configuration status
 */
export function getAnalyticsStatus(): {
  enabled: boolean;
  loaded: boolean;
  websiteId: string;
  debug: boolean;
} {
  return {
    enabled: analyticsConfig.enabled,
    loaded: isUmamiAvailable(),
    websiteId: analyticsConfig.websiteId,
    debug: analyticsConfig.debug,
  };
}
