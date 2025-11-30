/**
 * AdUnit Component
 * Google AdSense responsive ad unit with lazy loading and intersection observer
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ADSENSE_CLIENT_ID, LAZY_LOAD_CONFIG, isAdsEnabled, type AdFormat } from './adsense.config';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  lazyLoad?: boolean;
  className?: string;
  minHeight?: string;
  testMode?: boolean;
}

export default function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  lazyLoad = true,
  className = '',
  minHeight,
  testMode = false,
}: AdUnitProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const [hasError, setHasError] = useState(false);

  // Check if ads should be displayed
  const shouldShowAds = isAdsEnabled() || testMode;

  // Load the AdSense script globally (only once)
  const loadAdSenseScript = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-ad-client', ADSENSE_CLIENT_ID);

    script.onerror = () => {
      console.warn('AdSense script failed to load');
      setHasError(true);
    };

    document.head.appendChild(script);
  }, []);

  // Initialize the ad slot
  const initializeAd = useCallback(() => {
    if (!adRef.current || isLoaded) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      if (Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
        setIsLoaded(true);
      }
    } catch (error) {
      console.error('AdSense initialization error:', error);
      setHasError(true);
    }
  }, [isLoaded]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || !adContainerRef.current || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: LAZY_LOAD_CONFIG.rootMargin,
        threshold: LAZY_LOAD_CONFIG.threshold,
      }
    );

    observer.observe(adContainerRef.current);

    return () => observer.disconnect();
  }, [lazyLoad, isVisible]);

  // Load script and initialize ad when visible
  useEffect(() => {
    if (!shouldShowAds || !isVisible || isLoaded || hasError) return;

    loadAdSenseScript();

    // Wait for script to load before initializing
    const checkAndInit = () => {
      if (typeof window.adsbygoogle !== 'undefined') {
        initializeAd();
      } else {
        // Retry after a short delay
        setTimeout(checkAndInit, 100);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(checkAndInit, 100);

    return () => clearTimeout(timeoutId);
  }, [shouldShowAds, isVisible, isLoaded, hasError, loadAdSenseScript, initializeAd]);

  // Don't render anything if ads are disabled and not in test mode
  if (!shouldShowAds) {
    return null;
  }

  // Show placeholder during lazy load
  if (lazyLoad && !isVisible) {
    return (
      <div
        ref={adContainerRef}
        className={`ad-unit ad-placeholder ${className}`}
        style={{
          minHeight: minHeight || '100px',
          backgroundColor: 'transparent',
        }}
        aria-hidden="true"
      />
    );
  }

  // Show error state if ad failed to load
  if (hasError) {
    return null; // Silently hide failed ads
  }

  return (
    <div
      ref={adContainerRef}
      className={`ad-unit ${className}`}
      style={{ minHeight: minHeight || 'auto' }}
    >
      {/* Ad label for transparency */}
      <div className="mb-1 text-center text-xs text-gray-400 dark:text-gray-600">
        Advertisement
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: minHeight || 'auto',
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
