/**
 * Amazon Associates Integration
 * Handles Amazon affiliate link generation and Product Advertising API integration
 *
 * Setup Requirements:
 * 1. Sign up at https://affiliate-program.amazon.com/
 * 2. Get your Associate Tag
 * 3. Apply for Product Advertising API access (optional, for product data)
 * 4. Set environment variables
 */

// Environment variables (set in .env.local)
const ASSOCIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || '';
const ACCESS_KEY = process.env.AMAZON_PA_API_ACCESS_KEY || '';
const SECRET_KEY = process.env.AMAZON_PA_API_SECRET_KEY || '';
const PARTNER_TAG = process.env.AMAZON_PA_API_PARTNER_TAG || '';

// Amazon marketplace configurations
export const AMAZON_MARKETPLACES = {
  US: {
    domain: 'amazon.com',
    host: 'webservices.amazon.com',
    region: 'us-east-1',
    associateTag: ASSOCIATE_TAG,
  },
  UK: {
    domain: 'amazon.co.uk',
    host: 'webservices.amazon.co.uk',
    region: 'eu-west-1',
    associateTag: process.env.NEXT_PUBLIC_AMAZON_UK_ASSOCIATE_TAG || ASSOCIATE_TAG,
  },
  DE: {
    domain: 'amazon.de',
    host: 'webservices.amazon.de',
    region: 'eu-west-1',
    associateTag: process.env.NEXT_PUBLIC_AMAZON_DE_ASSOCIATE_TAG || ASSOCIATE_TAG,
  },
  FR: {
    domain: 'amazon.fr',
    host: 'webservices.amazon.fr',
    region: 'eu-west-1',
    associateTag: process.env.NEXT_PUBLIC_AMAZON_FR_ASSOCIATE_TAG || ASSOCIATE_TAG,
  },
  ES: {
    domain: 'amazon.es',
    host: 'webservices.amazon.es',
    region: 'eu-west-1',
    associateTag: process.env.NEXT_PUBLIC_AMAZON_ES_ASSOCIATE_TAG || ASSOCIATE_TAG,
  },
  IT: {
    domain: 'amazon.it',
    host: 'webservices.amazon.it',
    region: 'eu-west-1',
    associateTag: process.env.NEXT_PUBLIC_AMAZON_IT_ASSOCIATE_TAG || ASSOCIATE_TAG,
  },
  CA: {
    domain: 'amazon.ca',
    host: 'webservices.amazon.ca',
    region: 'us-east-1',
    associateTag: process.env.NEXT_PUBLIC_AMAZON_CA_ASSOCIATE_TAG || ASSOCIATE_TAG,
  },
  AU: {
    domain: 'amazon.com.au',
    host: 'webservices.amazon.com.au',
    region: 'us-west-2',
    associateTag: process.env.NEXT_PUBLIC_AMAZON_AU_ASSOCIATE_TAG || ASSOCIATE_TAG,
  },
} as const;

export type AmazonMarketplace = keyof typeof AMAZON_MARKETPLACES;

// Product types for KDP-related items
export type AmazonProductCategory =
  | 'kindle-device'
  | 'kindle-accessories'
  | 'books'
  | 'software'
  | 'office-supplies';

// Generate Amazon affiliate link
export function generateAmazonAffiliateLink(
  asin: string,
  marketplace: AmazonMarketplace = 'US',
  additionalParams?: Record<string, string>
): string {
  const config = AMAZON_MARKETPLACES[marketplace];

  const url = new URL(`https://www.${config.domain}/dp/${asin}`);
  url.searchParams.set('tag', config.associateTag);

  // Add tracking for our system
  url.searchParams.set('linkCode', 'ogi');
  url.searchParams.set('linkId', `kdptoolkit-${Date.now()}`);

  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

// Generate search affiliate link
export function generateAmazonSearchLink(
  searchQuery: string,
  marketplace: AmazonMarketplace = 'US',
  category?: AmazonProductCategory
): string {
  const config = AMAZON_MARKETPLACES[marketplace];

  const url = new URL(`https://www.${config.domain}/s`);
  url.searchParams.set('k', searchQuery);
  url.searchParams.set('tag', config.associateTag);

  if (category) {
    // Amazon category nodes (example values, adjust as needed)
    const categoryNodes: Record<AmazonProductCategory, string> = {
      'kindle-device': '6669702011',
      'kindle-accessories': '2642125011',
      books: '283155',
      software: '229534',
      'office-supplies': '1064954',
    };
    if (categoryNodes[category]) {
      url.searchParams.set('rh', `n:${categoryNodes[category]}`);
    }
  }

  return url.toString();
}

// Generate Best Sellers link
export function generateAmazonBestSellersLink(
  categoryNode: string,
  marketplace: AmazonMarketplace = 'US'
): string {
  const config = AMAZON_MARKETPLACES[marketplace];
  return `https://www.${config.domain}/gp/bestsellers/${categoryNode}?tag=${config.associateTag}`;
}

// Product Advertising API placeholder
// Note: PA-API requires approval and has rate limits
export interface AmazonProduct {
  asin: string;
  title: string;
  price?: {
    amount: number;
    currency: string;
    displayAmount: string;
  };
  images?: {
    primary: string;
    variants: string[];
  };
  rating?: number;
  reviewCount?: number;
  features?: string[];
  affiliateUrl: string;
}

// Placeholder for PA-API search
export async function searchAmazonProducts(
  keywords: string,
  marketplace: AmazonMarketplace = 'US'
): Promise<AmazonProduct[]> {
  // TODO: Implement Product Advertising API v5
  // This requires:
  // 1. AWS SDK v4 signing
  // 2. PA-API access approval
  // 3. Request signing with access/secret keys

  console.warn('Amazon PA-API not implemented. Using placeholder.');

  // Return placeholder data for development
  return [
    {
      asin: 'B09SWRYPB2',
      title: 'Kindle Paperwhite (16 GB)',
      price: {
        amount: 139.99,
        currency: 'USD',
        displayAmount: '$139.99',
      },
      rating: 4.7,
      reviewCount: 85432,
      affiliateUrl: generateAmazonAffiliateLink('B09SWRYPB2', marketplace),
    },
  ];
}

// Placeholder for PA-API item lookup
export async function getAmazonProduct(
  asin: string,
  marketplace: AmazonMarketplace = 'US'
): Promise<AmazonProduct | null> {
  // TODO: Implement PA-API GetItems operation

  console.warn('Amazon PA-API not implemented. Using placeholder.');

  return {
    asin,
    title: `Product ${asin}`,
    affiliateUrl: generateAmazonAffiliateLink(asin, marketplace),
  };
}

// Commonly promoted KDP-related products
export const KDP_RECOMMENDED_PRODUCTS: Record<string, { asin: string; title: string; category: AmazonProductCategory }[]> = {
  US: [
    { asin: 'B09SWRYPB2', title: 'Kindle Paperwhite', category: 'kindle-device' },
    { asin: 'B08VWVG1RD', title: 'Kindle Oasis', category: 'kindle-device' },
    { asin: 'B07CZRZBJL', title: 'Fire HD 10 Tablet', category: 'kindle-device' },
    { asin: 'B07FJ5GL5J', title: 'Kindle Paperwhite Fabric Cover', category: 'kindle-accessories' },
  ],
};

// Check if PA-API is configured
export function isAmazonPAAPIConfigured(): boolean {
  return !!(ACCESS_KEY && SECRET_KEY && PARTNER_TAG);
}

// Commission rates by category (Amazon Associates)
export const AMAZON_COMMISSION_RATES: Record<string, number> = {
  'Physical Books': 4.5,
  'Kindle Devices': 4.0,
  'Kindle Accessories': 4.0,
  'Digital Music': 5.0,
  'Physical Music/DVD': 5.0,
  'Software': 2.5,
  'Video Games': 1.0,
  'Electronics': 4.0,
  'Everything Else': 4.0,
};
