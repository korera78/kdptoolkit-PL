/**
 * Affiliate Link Management Library
 * Core utilities for affiliate link handling, tracking, and configuration
 */

// Types for affiliate programs
export interface AffiliateProgram {
  id: string;
  name: string;
  baseUrl: string;
  trackingParam: string;
  commissionType: 'percentage' | 'fixed';
  commissionRate: number;
  cookieDuration: number; // days
  enabled: boolean;
}

export interface AffiliateLink {
  id: string;
  programId: string;
  originalUrl: string;
  affiliateUrl: string;
  productName: string;
  category: string;
  createdAt: Date;
  clickCount: number;
  conversionCount: number;
}

export interface ClickEvent {
  id: string;
  linkId: string;
  timestamp: Date;
  referrer: string;
  userAgent: string;
  ipHash: string; // Hashed for privacy
  sessionId: string;
  converted: boolean;
  conversionValue?: number;
}

// Affiliate program configurations
export const AFFILIATE_PROGRAMS: Record<string, AffiliateProgram> = {
  amazon: {
    id: 'amazon',
    name: 'Amazon Associates',
    baseUrl: 'https://www.amazon.com',
    trackingParam: 'tag',
    commissionType: 'percentage',
    commissionRate: 4.0, // Average for books
    cookieDuration: 1, // 24 hours
    enabled: true,
  },
  shareasale: {
    id: 'shareasale',
    name: 'ShareASale',
    baseUrl: 'https://www.shareasale.com',
    trackingParam: 'afftrack',
    commissionType: 'percentage',
    commissionRate: 10.0,
    cookieDuration: 30,
    enabled: true,
  },
  publisherRocket: {
    id: 'publisher-rocket',
    name: 'Publisher Rocket',
    baseUrl: 'https://publisherrocket.com',
    trackingParam: 'ref',
    commissionType: 'percentage',
    commissionRate: 30.0,
    cookieDuration: 60,
    enabled: true,
  },
  helium10: {
    id: 'helium10',
    name: 'Helium 10',
    baseUrl: 'https://helium10.com',
    trackingParam: 'referral',
    commissionType: 'percentage',
    commissionRate: 25.0,
    cookieDuration: 30,
    enabled: true,
  },
  canva: {
    id: 'canva',
    name: 'Canva',
    baseUrl: 'https://www.canva.com',
    trackingParam: 'ref',
    commissionType: 'fixed',
    commissionRate: 36.0, // Per sale
    cookieDuration: 30,
    enabled: true,
  },
  bookbolt: {
    id: 'bookbolt',
    name: 'BookBolt',
    baseUrl: 'https://bookbolt.io',
    trackingParam: 'ref',
    commissionType: 'percentage',
    commissionRate: 30.0,
    cookieDuration: 30,
    enabled: true,
  },
};

// Generate affiliate URL with tracking
export function generateAffiliateUrl(
  originalUrl: string,
  programId: string,
  affiliateId: string,
  additionalParams?: Record<string, string>
): string {
  const program = AFFILIATE_PROGRAMS[programId];
  if (!program || !program.enabled) {
    return originalUrl;
  }

  try {
    const url = new URL(originalUrl);
    url.searchParams.set(program.trackingParam, affiliateId);

    // Add any additional tracking parameters
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  } catch {
    // If URL parsing fails, return original
    return originalUrl;
  }
}

// Amazon-specific URL generation
export function generateAmazonUrl(
  asin: string,
  associateTag: string,
  marketplace: string = 'US'
): string {
  const marketplaceDomains: Record<string, string> = {
    US: 'amazon.com',
    UK: 'amazon.co.uk',
    DE: 'amazon.de',
    FR: 'amazon.fr',
    ES: 'amazon.es',
    IT: 'amazon.it',
    CA: 'amazon.ca',
    AU: 'amazon.com.au',
  };

  const domain = marketplaceDomains[marketplace] || marketplaceDomains.US;
  return `https://www.${domain}/dp/${asin}?tag=${associateTag}`;
}

// ShareASale deep link generation
export function generateShareASaleUrl(
  merchantId: string,
  affiliateId: string,
  destinationUrl: string
): string {
  const encodedUrl = encodeURIComponent(destinationUrl);
  return `https://www.shareasale.com/r.cfm?b=1&u=${affiliateId}&m=${merchantId}&urllink=${encodedUrl}`;
}

// Cookie management utilities
export const AFFILIATE_COOKIE_NAME = 'kdp_aff';
export const AFFILIATE_SESSION_COOKIE = 'kdp_aff_session';

export interface AffiliateCookieData {
  linkId: string;
  programId: string;
  clickedAt: number;
  expiresAt: number;
  sessionId: string;
}

export function createAffiliateCookie(
  linkId: string,
  programId: string,
  sessionId: string
): AffiliateCookieData {
  const program = AFFILIATE_PROGRAMS[programId];
  const cookieDuration = program?.cookieDuration || 30;
  const now = Date.now();

  return {
    linkId,
    programId,
    clickedAt: now,
    expiresAt: now + cookieDuration * 24 * 60 * 60 * 1000,
    sessionId,
  };
}

// Session ID generation (privacy-respecting)
export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Hash IP for privacy-compliant storage
export async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + process.env.IP_HASH_SALT || 'kdp-toolkit-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

// Category slugs for link organization
export const AFFILIATE_CATEGORIES = [
  'keyword-research',
  'book-design',
  'book-formatting',
  'marketing-tools',
  'analytics',
  'automation',
  'courses',
  'books',
  'software',
  'services',
] as const;

export type AffiliateCategory = (typeof AFFILIATE_CATEGORIES)[number];

// Link validation
export function isValidAffiliateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Commission calculation
export function calculateCommission(
  saleAmount: number,
  programId: string
): number {
  const program = AFFILIATE_PROGRAMS[programId];
  if (!program) return 0;

  if (program.commissionType === 'percentage') {
    return (saleAmount * program.commissionRate) / 100;
  }
  return program.commissionRate;
}

// Format currency for display
export function formatCommission(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
