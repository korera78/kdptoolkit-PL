'use client';

/**
 * React Hook for Umami Analytics
 * Provides easy-to-use analytics tracking with automatic page view tracking
 *
 * Usage:
 * ```tsx
 * const { trackAffiliateClick, trackNewsletterSignup } = useAnalytics();
 *
 * // Track affiliate click
 * trackAffiliateClick('amazon', 'Publisher Rocket', 'https://...');
 *
 * // Track newsletter signup
 * trackNewsletterSignup('sidebar-form');
 * ```
 */

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  trackEvent,
  trackPageView,
  trackAffiliateClick as trackAffiliateClickFn,
  trackCalculatorUse as trackCalculatorUseFn,
  trackNewsletterSignup as trackNewsletterSignupFn,
  trackGuideDownload as trackGuideDownloadFn,
  trackToolComparison as trackToolComparisonFn,
  trackSearchQuery as trackSearchQueryFn,
  trackCtaClick as trackCtaClickFn,
  trackShareClick as trackShareClickFn,
  trackScrollDepth as trackScrollDepthFn,
  trackTimeOnPage as trackTimeOnPageFn,
  analyticsConfig,
  isUmamiAvailable,
  type AnalyticsEventType,
  type AnalyticsEventData,
} from '@/lib/analytics';

// ============================================================================
// Types
// ============================================================================

export interface UseAnalyticsOptions {
  /** Enable automatic page view tracking (default: true) */
  autoTrackPageViews?: boolean;
  /** Enable scroll depth tracking (default: false) */
  trackScrollDepth?: boolean;
  /** Enable time on page tracking (default: false) */
  trackTimeOnPage?: boolean;
  /** Scroll depth milestones to track (default: [25, 50, 75, 100]) */
  scrollMilestones?: number[];
  /** Time on page milestones in seconds (default: [30, 60, 120, 300]) */
  timeMilestones?: number[];
}

export interface UseAnalyticsReturn {
  /** Whether analytics is enabled */
  isEnabled: boolean;
  /** Whether Umami is loaded */
  isLoaded: boolean;
  /** Track a custom event */
  trackCustomEvent: (eventType: AnalyticsEventType, data?: AnalyticsEventData) => void;
  /** Track affiliate link click */
  trackAffiliateClick: (programId: string, productName: string, linkUrl: string, category?: string) => void;
  /** Track calculator usage */
  trackCalculatorUse: (calculatorType: string, inputValues: Record<string, string | number>, result: string | number) => void;
  /** Track newsletter signup */
  trackNewsletterSignup: (formLocation: string, listId?: string) => void;
  /** Track guide download */
  trackGuideDownload: (guideSlug: string, guideTitle: string, format?: string) => void;
  /** Track tool comparison */
  trackToolComparison: (tools: string[], category: string) => void;
  /** Track search query */
  trackSearchQuery: (query: string, resultsCount: number, category?: string) => void;
  /** Track CTA click */
  trackCtaClick: (ctaName: string, location: string, destination?: string) => void;
  /** Track social share click */
  trackShareClick: (platform: string, contentUrl: string, contentTitle?: string) => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const {
    autoTrackPageViews = true,
    trackScrollDepth = false,
    trackTimeOnPage = false,
    scrollMilestones = [25, 50, 75, 100],
    timeMilestones = [30, 60, 120, 300],
  } = options;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Refs for tracking state
  const pageLoadTime = useRef<number>(Date.now());
  const trackedScrollMilestones = useRef<Set<number>>(new Set());
  const trackedTimeMilestones = useRef<Set<number>>(new Set());
  const timeTrackingInterval = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // Auto Page View Tracking
  // ============================================================================

  useEffect(() => {
    if (!autoTrackPageViews || !analyticsConfig.enabled) return;

    // Build full URL from pathname and search params
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname || '/';

    trackPageView({ url });

    // Reset tracking state for new page
    pageLoadTime.current = Date.now();
    trackedScrollMilestones.current.clear();
    trackedTimeMilestones.current.clear();
  }, [pathname, searchParams, autoTrackPageViews]);

  // ============================================================================
  // Scroll Depth Tracking
  // ============================================================================

  useEffect(() => {
    if (!trackScrollDepth || !analyticsConfig.enabled || typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      scrollMilestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !trackedScrollMilestones.current.has(milestone)
        ) {
          trackedScrollMilestones.current.add(milestone);
          trackScrollDepthFn(milestone);
        }
      });
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [trackScrollDepth, scrollMilestones]);

  // ============================================================================
  // Time on Page Tracking
  // ============================================================================

  useEffect(() => {
    if (!trackTimeOnPage || !analyticsConfig.enabled) return;

    timeTrackingInterval.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - pageLoadTime.current) / 1000);

      timeMilestones.forEach((milestone) => {
        if (
          elapsed >= milestone &&
          !trackedTimeMilestones.current.has(milestone)
        ) {
          trackedTimeMilestones.current.add(milestone);
          trackTimeOnPageFn(milestone);
        }
      });
    }, 5000); // Check every 5 seconds

    return () => {
      if (timeTrackingInterval.current) {
        clearInterval(timeTrackingInterval.current);
      }
    };
  }, [trackTimeOnPage, timeMilestones]);

  // ============================================================================
  // Memoized Tracking Functions
  // ============================================================================

  const trackCustomEvent = useCallback(
    (eventType: AnalyticsEventType, data?: AnalyticsEventData) => {
      trackEvent(eventType, data);
    },
    []
  );

  const trackAffiliateClick = useCallback(
    (programId: string, productName: string, linkUrl: string, category?: string) => {
      trackAffiliateClickFn(programId, productName, linkUrl, category);
    },
    []
  );

  const trackCalculatorUse = useCallback(
    (calculatorType: string, inputValues: Record<string, string | number>, result: string | number) => {
      trackCalculatorUseFn(calculatorType, inputValues, result);
    },
    []
  );

  const trackNewsletterSignup = useCallback(
    (formLocation: string, listId?: string) => {
      trackNewsletterSignupFn(formLocation, listId);
    },
    []
  );

  const trackGuideDownload = useCallback(
    (guideSlug: string, guideTitle: string, format?: string) => {
      trackGuideDownloadFn(guideSlug, guideTitle, format);
    },
    []
  );

  const trackToolComparison = useCallback(
    (tools: string[], category: string) => {
      trackToolComparisonFn(tools, category);
    },
    []
  );

  const trackSearchQuery = useCallback(
    (query: string, resultsCount: number, category?: string) => {
      trackSearchQueryFn(query, resultsCount, category);
    },
    []
  );

  const trackCtaClick = useCallback(
    (ctaName: string, location: string, destination?: string) => {
      trackCtaClickFn(ctaName, location, destination);
    },
    []
  );

  const trackShareClick = useCallback(
    (platform: string, contentUrl: string, contentTitle?: string) => {
      trackShareClickFn(platform, contentUrl, contentTitle);
    },
    []
  );

  // ============================================================================
  // Return Value
  // ============================================================================

  return {
    isEnabled: analyticsConfig.enabled,
    isLoaded: typeof window !== 'undefined' && isUmamiAvailable(),
    trackCustomEvent,
    trackAffiliateClick,
    trackCalculatorUse,
    trackNewsletterSignup,
    trackGuideDownload,
    trackToolComparison,
    trackSearchQuery,
    trackCtaClick,
    trackShareClick,
  };
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Hook for tracking engagement metrics (scroll depth + time on page)
 */
export function useEngagementTracking(): void {
  useAnalytics({
    autoTrackPageViews: true,
    trackScrollDepth: true,
    trackTimeOnPage: true,
  });
}

/**
 * Hook for tracking affiliate link interactions
 */
export function useAffiliateTracking() {
  const { trackAffiliateClick, trackCtaClick, isEnabled } = useAnalytics({
    autoTrackPageViews: false,
  });

  const handleAffiliateClick = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      programId: string,
      productName: string,
      category?: string
    ) => {
      const linkUrl = event.currentTarget.href;
      trackAffiliateClick(programId, productName, linkUrl, category);
    },
    [trackAffiliateClick]
  );

  return {
    isEnabled,
    trackAffiliateClick,
    trackCtaClick,
    handleAffiliateClick,
  };
}

export default useAnalytics;
