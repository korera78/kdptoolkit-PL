'use client';

/**
 * AffiliateTrackingPixel Component
 * Invisible tracking pixel for page impressions and conversion attribution
 */

import { useEffect, useRef } from 'react';
import { generateSessionId } from '@/lib/affiliate';

interface AffiliateTrackingPixelProps {
  programId?: string;
  pageType?: 'product' | 'category' | 'conversion' | 'general';
  productId?: string;
  category?: string;
  conversionValue?: number;
}

export default function AffiliateTrackingPixel({
  programId,
  pageType = 'general',
  productId,
  category,
  conversionValue,
}: AffiliateTrackingPixelProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (tracked.current) return;
    tracked.current = true;

    // Get or create session ID
    let sessionId = sessionStorage.getItem('aff_session');
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem('aff_session', sessionId);
    }

    // Track impression
    fetch('/api/affiliate/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: pageType === 'conversion' ? 'conversion' : 'impression',
        programId: programId || 'general',
        productName: productId,
        category,
        url: window.location.href,
        sessionId,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        conversionValue,
      }),
      keepalive: true,
    }).catch(() => {
      // Silent fail - tracking shouldn't affect UX
    });
  }, [programId, pageType, productId, category, conversionValue]);

  // Return nothing visible
  return null;
}

// Cookie consent-aware tracking wrapper
export function ConsentAwareTrackingPixel({
  children,
  ...props
}: AffiliateTrackingPixelProps & { children?: React.ReactNode }) {
  useEffect(() => {
    // Check for cookie consent
    const hasConsent = document.cookie.includes('cookie_consent=accepted');

    if (!hasConsent) {
      console.log('Affiliate tracking disabled: no cookie consent');
      return;
    }
  }, []);

  return (
    <>
      <AffiliateTrackingPixel {...props} />
      {children}
    </>
  );
}

// Conversion tracking component for thank-you pages
export function ConversionPixel({
  orderId,
  orderValue,
  programId,
}: {
  orderId: string;
  orderValue: number;
  programId: string;
}) {
  useEffect(() => {
    // Get affiliate cookie to attribute conversion
    const cookies = document.cookie.split(';');
    const affCookie = cookies.find(c => c.trim().startsWith('kdp_aff='));

    if (!affCookie) {
      console.log('No affiliate cookie found for conversion');
      return;
    }

    try {
      const cookieValue = decodeURIComponent(affCookie.split('=')[1]);
      const affiliateData = JSON.parse(cookieValue);

      // Track conversion with affiliate attribution
      fetch('/api/affiliate/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'conversion',
          programId: affiliateData.programId || programId,
          url: window.location.href,
          sessionId: affiliateData.sessionId,
          timestamp: new Date().toISOString(),
          conversionValue: orderValue,
          orderId,
        }),
        keepalive: true,
      });

      // Clear affiliate cookie after conversion
      document.cookie = 'kdp_aff=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (error) {
      console.error('Error processing conversion:', error);
    }
  }, [orderId, orderValue, programId]);

  return null;
}
