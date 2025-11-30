'use client';

/**
 * AffiliateLink Component
 * Renders affiliate links with tracking and disclosure
 */

import { useEffect, useCallback } from 'react';
import {
  generateAffiliateUrl,
  generateAmazonUrl,
  AFFILIATE_PROGRAMS,
  AFFILIATE_COOKIE_NAME,
  generateSessionId,
  createAffiliateCookie,
  type AffiliateCategory,
} from '@/lib/affiliate';

interface AffiliateLinkProps {
  href: string;
  programId: keyof typeof AFFILIATE_PROGRAMS | string;
  productName?: string;
  category?: AffiliateCategory;
  className?: string;
  children: React.ReactNode;
  showDisclosure?: boolean;
  openInNewTab?: boolean;
  // Amazon-specific props
  asin?: string;
  marketplace?: string;
}

// Environment variables (set in .env.local)
const AMAZON_ASSOCIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || '';
const SHAREASALE_AFFILIATE_ID = process.env.NEXT_PUBLIC_SHAREASALE_AFFILIATE_ID || '';

export default function AffiliateLink({
  href,
  programId,
  productName,
  category,
  className = '',
  children,
  showDisclosure = true,
  openInNewTab = true,
  asin,
  marketplace = 'US',
}: AffiliateLinkProps) {
  // Generate the appropriate affiliate URL
  const getAffiliateUrl = useCallback(() => {
    if (programId === 'amazon' && asin) {
      return generateAmazonUrl(asin, AMAZON_ASSOCIATE_TAG, marketplace);
    }

    // Get affiliate ID based on program
    let affiliateId = '';
    switch (programId) {
      case 'amazon':
        affiliateId = AMAZON_ASSOCIATE_TAG;
        break;
      case 'shareasale':
        affiliateId = SHAREASALE_AFFILIATE_ID;
        break;
      default:
        // Use generic tracking from environment
        affiliateId = process.env[`NEXT_PUBLIC_${programId.toUpperCase().replace('-', '_')}_AFFILIATE_ID`] || '';
    }

    return generateAffiliateUrl(href, programId, affiliateId);
  }, [href, programId, asin, marketplace]);

  const affiliateUrl = getAffiliateUrl();

  // Track click event
  const handleClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Generate or retrieve session ID
    let sessionId = '';
    if (typeof window !== 'undefined') {
      sessionId = sessionStorage.getItem('aff_session') || generateSessionId();
      sessionStorage.setItem('aff_session', sessionId);

      // Set cookie for conversion tracking
      const cookieData = createAffiliateCookie(href, programId, sessionId);
      document.cookie = `${AFFILIATE_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(cookieData))}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    }

    // Send click event to tracking API (non-blocking)
    try {
      fetch('/api/affiliate/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'click',
          programId,
          productName,
          category,
          url: href,
          sessionId,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          timestamp: new Date().toISOString(),
        }),
        keepalive: true, // Ensure request completes even if page navigates
      }).catch(() => {
        // Silently fail tracking - don't block user navigation
      });
    } catch {
      // Tracking failure shouldn't affect UX
    }
  }, [href, programId, productName, category]);

  const program = AFFILIATE_PROGRAMS[programId as keyof typeof AFFILIATE_PROGRAMS];

  return (
    <span className="inline-flex items-center gap-1">
      <a
        href={affiliateUrl}
        onClick={handleClick}
        className={`affiliate-link ${className}`}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer sponsored' : 'sponsored'}
        data-program={programId}
        data-category={category}
      >
        {children}
      </a>
      {showDisclosure && (
        <span
          className="text-xs text-gray-500 dark:text-gray-400 cursor-help"
          title={`Affiliate link - ${program?.name || programId}. We may earn a commission if you make a purchase.`}
        >
          *
        </span>
      )}
    </span>
  );
}

// Simpler component for inline affiliate text links
export function AffiliateTextLink({
  href,
  programId,
  children,
  className = 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline',
  ...props
}: Omit<AffiliateLinkProps, 'showDisclosure'>) {
  return (
    <AffiliateLink
      href={href}
      programId={programId}
      className={className}
      showDisclosure={false}
      {...props}
    >
      {children}
    </AffiliateLink>
  );
}

// Button-style affiliate link
export function AffiliateButton({
  href,
  programId,
  children,
  variant = 'primary',
  size = 'md',
  ...props
}: AffiliateLinkProps & {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-gray-800',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <AffiliateLink
      href={href}
      programId={programId}
      className={`inline-flex items-center justify-center rounded-md font-semibold transition-colors ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </AffiliateLink>
  );
}

// Product card with affiliate link
interface AffiliateProductCardProps extends AffiliateLinkProps {
  image?: string;
  price?: string;
  rating?: number;
  description?: string;
}

export function AffiliateProductCard({
  href,
  programId,
  productName,
  image,
  price,
  rating,
  description,
  category,
  ...props
}: AffiliateProductCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {image && (
        <div className="mb-3 aspect-video overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
          <img
            src={image}
            alt={productName || 'Product'}
            className="h-full w-full object-contain"
          />
        </div>
      )}

      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {productName}
      </h3>

      {description && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      )}

      <div className="flex items-center justify-between">
        {price && (
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {price}
          </span>
        )}

        {rating && (
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <AffiliateButton
          href={href}
          programId={programId}
          productName={productName}
          category={category}
          variant="primary"
          size="sm"
          {...props}
        >
          Check Price
        </AffiliateButton>
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Affiliate link - we may earn a commission
      </p>
    </div>
  );
}
