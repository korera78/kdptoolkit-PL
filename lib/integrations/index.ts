/**
 * Affiliate Integrations Index
 * Central export point for all affiliate network integrations
 */

// Amazon Associates
export {
  generateAmazonAffiliateLink,
  generateAmazonSearchLink,
  generateAmazonBestSellersLink,
  searchAmazonProducts,
  getAmazonProduct,
  isAmazonPAAPIConfigured,
  AMAZON_MARKETPLACES,
  AMAZON_COMMISSION_RATES,
  KDP_RECOMMENDED_PRODUCTS,
  type AmazonMarketplace,
  type AmazonProduct,
  type AmazonProductCategory,
} from './amazon-associates';

// ShareASale
export {
  generateShareASaleLink,
  generateMerchantLink,
  getTransactionReport,
  getMerchantStatus,
  getApprovedMerchants,
  getActivityMetrics,
  isShareASaleConfigured,
  getCreativeUrl,
  getDataFeedUrl,
  SHAREASALE_MERCHANTS,
  type ShareASaleMerchant,
  type ShareASaleTransaction,
  type ShareASaleMerchantInfo,
} from './shareasale';

// Re-export core affiliate utilities
export {
  AFFILIATE_PROGRAMS,
  AFFILIATE_CATEGORIES,
  generateAffiliateUrl,
  generateSessionId,
  createAffiliateCookie,
  calculateCommission,
  formatCommission,
  isValidAffiliateUrl,
  hashIp,
  type AffiliateProgram,
  type AffiliateLink,
  type ClickEvent,
  type AffiliateCategory,
  type AffiliateCookieData,
} from '../affiliate';

// Integration status check
export function checkIntegrationStatus(): {
  amazon: { configured: boolean; features: string[] };
  shareasale: { configured: boolean; features: string[] };
} {
  const amazonConfigured = !!process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG;
  const amazonPAAPI = !!(
    process.env.AMAZON_PA_API_ACCESS_KEY &&
    process.env.AMAZON_PA_API_SECRET_KEY
  );

  const shareasaleConfigured = !!process.env.SHAREASALE_AFFILIATE_ID;
  const shareasaleAPI = !!(
    process.env.SHAREASALE_API_TOKEN &&
    process.env.SHAREASALE_API_SECRET
  );

  return {
    amazon: {
      configured: amazonConfigured,
      features: [
        amazonConfigured ? 'Affiliate Links' : null,
        amazonPAAPI ? 'Product API' : null,
      ].filter(Boolean) as string[],
    },
    shareasale: {
      configured: shareasaleConfigured,
      features: [
        shareasaleConfigured ? 'Affiliate Links' : null,
        shareasaleAPI ? 'Transaction API' : null,
        shareasaleAPI ? 'Merchant API' : null,
      ].filter(Boolean) as string[],
    },
  };
}
