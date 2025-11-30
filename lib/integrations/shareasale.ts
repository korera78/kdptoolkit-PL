/**
 * ShareASale Integration
 * Handles ShareASale affiliate link generation and API integration
 *
 * Setup Requirements:
 * 1. Sign up at https://www.shareasale.com/join.cfm
 * 2. Get approved for merchant programs
 * 3. Get your Affiliate ID
 * 4. Generate API Token and Secret Key
 * 5. Set environment variables
 */

// Environment variables (set in .env.local)
const AFFILIATE_ID = process.env.SHAREASALE_AFFILIATE_ID || '';
const API_TOKEN = process.env.SHAREASALE_API_TOKEN || '';
const API_SECRET = process.env.SHAREASALE_API_SECRET || '';

// ShareASale merchant IDs for KDP-related services
export const SHAREASALE_MERCHANTS = {
  // Design & Creativity Tools
  canva: {
    merchantId: '39344',
    name: 'Canva',
    commissionType: 'fixed' as const,
    commission: 36.00,
    category: 'book-design',
  },

  // Self-Publishing Services
  bookBaby: {
    merchantId: '28169',
    name: 'BookBaby',
    commissionType: 'percentage' as const,
    commission: 5.0,
    category: 'publishing-services',
  },

  // Stock Photos
  depositPhotos: {
    merchantId: '40670',
    name: 'Depositphotos',
    commissionType: 'percentage' as const,
    commission: 40.0,
    category: 'book-design',
  },

  // Writing Tools
  grammarly: {
    merchantId: '83198',
    name: 'Grammarly',
    commissionType: 'hybrid' as const,
    commission: 20.0, // Base + up to $20 per sale
    category: 'writing-tools',
  },

  // Placeholder for additional merchants
  // Add more as you get approved
} as const;

export type ShareASaleMerchant = keyof typeof SHAREASALE_MERCHANTS;

// Generate ShareASale affiliate link
export function generateShareASaleLink(
  merchantId: string,
  destinationUrl: string,
  additionalTracking?: string
): string {
  const encodedUrl = encodeURIComponent(destinationUrl);

  // Standard ShareASale deep link format
  let url = `https://www.shareasale.com/r.cfm?b=1&u=${AFFILIATE_ID}&m=${merchantId}&urllink=${encodedUrl}`;

  // Add custom tracking if provided
  if (additionalTracking) {
    url += `&afftrack=${encodeURIComponent(additionalTracking)}`;
  }

  return url;
}

// Generate link for known merchant
export function generateMerchantLink(
  merchant: ShareASaleMerchant,
  destinationUrl?: string,
  tracking?: string
): string {
  const config = SHAREASALE_MERCHANTS[merchant];

  // Default destination URLs for each merchant
  const defaultUrls: Record<ShareASaleMerchant, string> = {
    canva: 'https://www.canva.com/pro/',
    bookBaby: 'https://www.bookbaby.com/book-printing',
    depositPhotos: 'https://depositphotos.com/',
    grammarly: 'https://www.grammarly.com/premium',
  };

  const url = destinationUrl || defaultUrls[merchant];
  return generateShareASaleLink(config.merchantId, url, tracking);
}

// ShareASale API placeholder types
export interface ShareASaleTransaction {
  transactionId: string;
  transactionDate: string;
  merchantId: string;
  merchantName: string;
  transactionAmount: number;
  commission: number;
  status: 'pending' | 'locked' | 'paid' | 'void';
  affTrack?: string;
}

export interface ShareASaleMerchantInfo {
  merchantId: string;
  merchantName: string;
  category: string;
  averageCommission: number;
  averageSaleAmount: number;
  conversionRate: number;
  epc: number; // Earnings Per Click
  status: 'active' | 'pending' | 'declined';
}

// API Helper - Generate authentication
function generateShareASaleAuth(action: string): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  // In production, implement proper HMAC-SHA256 signing
  // const signature = crypto.createHmac('sha256', API_SECRET)
  //   .update(`${API_TOKEN}:${timestamp}:${action}:${API_SECRET}`)
  //   .digest('hex');

  return {
    'x-ShareASale-Date': timestamp,
    'x-ShareASale-Authentication': API_TOKEN,
    // In production: 'x-ShareASale-Sig': signature,
  };
}

// Placeholder for transaction report
export async function getTransactionReport(
  startDate: string,
  endDate: string
): Promise<ShareASaleTransaction[]> {
  // TODO: Implement ShareASale Transaction Detail Report API
  // Endpoint: https://api.shareasale.com/x.cfm
  // Action: transactiondetail

  if (!API_TOKEN || !API_SECRET) {
    console.warn('ShareASale API not configured. Using placeholder data.');
    return [];
  }

  console.warn('ShareASale API not fully implemented. Using placeholder.');

  // Placeholder response
  return [
    {
      transactionId: 'SAS-123456',
      transactionDate: new Date().toISOString(),
      merchantId: '39344',
      merchantName: 'Canva',
      transactionAmount: 119.99,
      commission: 36.00,
      status: 'pending',
    },
  ];
}

// Placeholder for merchant status check
export async function getMerchantStatus(
  merchantId: string
): Promise<ShareASaleMerchantInfo | null> {
  // TODO: Implement ShareASale Merchant Status API

  if (!API_TOKEN) {
    console.warn('ShareASale API not configured.');
    return null;
  }

  // Find merchant in our config
  const merchant = Object.values(SHAREASALE_MERCHANTS).find(
    (m) => m.merchantId === merchantId
  );

  if (!merchant) {
    return null;
  }

  // Placeholder response
  return {
    merchantId: merchant.merchantId,
    merchantName: merchant.name,
    category: merchant.category,
    averageCommission: merchant.commission,
    averageSaleAmount: 50.0,
    conversionRate: 3.5,
    epc: 0.15,
    status: 'active',
  };
}

// Get all approved merchants
export async function getApprovedMerchants(): Promise<ShareASaleMerchantInfo[]> {
  // TODO: Implement ShareASale Merchant API

  // Return placeholder data from our config
  return Object.entries(SHAREASALE_MERCHANTS).map(([key, merchant]) => ({
    merchantId: merchant.merchantId,
    merchantName: merchant.name,
    category: merchant.category,
    averageCommission: merchant.commission,
    averageSaleAmount: 50.0,
    conversionRate: 3.5,
    epc: 0.15,
    status: 'active' as const,
  }));
}

// Activity metrics placeholder
export async function getActivityMetrics(
  startDate: string,
  endDate: string
): Promise<{
  clicks: number;
  transactions: number;
  commissions: number;
  conversionRate: number;
}> {
  // TODO: Implement ShareASale Activity Summary API

  console.warn('ShareASale Activity API not implemented.');

  return {
    clicks: 0,
    transactions: 0,
    commissions: 0,
    conversionRate: 0,
  };
}

// Check if ShareASale API is configured
export function isShareASaleConfigured(): boolean {
  return !!(AFFILIATE_ID && API_TOKEN && API_SECRET);
}

// Creative/Banner URL generator
export function getCreativeUrl(
  merchantId: string,
  bannerSize: '728x90' | '300x250' | '160x600' | '120x60' = '300x250'
): string {
  // ShareASale banner format
  return `https://www.shareasale.com/image/${merchantId}/${AFFILIATE_ID}/${bannerSize}`;
}

// Product feed URL (for merchants with data feeds)
export function getDataFeedUrl(merchantId: string): string {
  return `https://www.shareasale.com/datafeed.cfm?merchantId=${merchantId}&token=${API_TOKEN}`;
}
