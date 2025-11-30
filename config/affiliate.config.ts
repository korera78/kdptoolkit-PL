/**
 * Affiliate Program Configuration
 * Central configuration for all affiliate integrations
 *
 * Usage:
 * 1. Copy .env.example to .env.local
 * 2. Fill in your affiliate credentials
 * 3. Enable/disable programs as needed
 */

export interface AffiliateConfig {
  // Global settings
  enabled: boolean;
  trackingEnabled: boolean;
  cookieConsent: boolean; // Require cookie consent before tracking

  // Amazon Associates
  amazon: {
    enabled: boolean;
    associateTag: string;
    marketplaces: string[];
    paApiEnabled: boolean;
    paApiAccessKey: string;
    paApiSecretKey: string;
  };

  // ShareASale
  shareasale: {
    enabled: boolean;
    affiliateId: string;
    apiToken: string;
    apiSecret: string;
    enabledMerchants: string[];
  };

  // Other affiliate programs
  programs: {
    [key: string]: {
      enabled: boolean;
      affiliateId: string;
      apiKey?: string;
    };
  };

  // Tracking settings
  tracking: {
    cookieDurationDays: number;
    sessionDurationMinutes: number;
    pixelEnabled: boolean;
    webhookEndpoint: string;
  };

  // Disclosure settings
  disclosure: {
    showOnAllLinks: boolean;
    disclosureText: string;
    disclosurePage: string;
  };
}

// Load configuration from environment variables
export function loadAffiliateConfig(): AffiliateConfig {
  return {
    enabled: process.env.NEXT_PUBLIC_AFFILIATE_ENABLED !== 'false',
    trackingEnabled: process.env.NEXT_PUBLIC_AFFILIATE_TRACKING !== 'false',
    cookieConsent: process.env.NEXT_PUBLIC_REQUIRE_COOKIE_CONSENT === 'true',

    amazon: {
      enabled: !!process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG,
      associateTag: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || '',
      marketplaces: (process.env.AMAZON_MARKETPLACES || 'US').split(','),
      paApiEnabled: !!process.env.AMAZON_PA_API_ACCESS_KEY,
      paApiAccessKey: process.env.AMAZON_PA_API_ACCESS_KEY || '',
      paApiSecretKey: process.env.AMAZON_PA_API_SECRET_KEY || '',
    },

    shareasale: {
      enabled: !!process.env.SHAREASALE_AFFILIATE_ID,
      affiliateId: process.env.SHAREASALE_AFFILIATE_ID || '',
      apiToken: process.env.SHAREASALE_API_TOKEN || '',
      apiSecret: process.env.SHAREASALE_API_SECRET || '',
      enabledMerchants: (process.env.SHAREASALE_MERCHANTS || 'canva,grammarly').split(','),
    },

    programs: {
      publisherRocket: {
        enabled: !!process.env.NEXT_PUBLIC_PUBLISHER_ROCKET_AFFILIATE_ID,
        affiliateId: process.env.NEXT_PUBLIC_PUBLISHER_ROCKET_AFFILIATE_ID || '',
      },
      helium10: {
        enabled: !!process.env.NEXT_PUBLIC_HELIUM10_AFFILIATE_ID,
        affiliateId: process.env.NEXT_PUBLIC_HELIUM10_AFFILIATE_ID || '',
      },
      bookbolt: {
        enabled: !!process.env.NEXT_PUBLIC_BOOKBOLT_AFFILIATE_ID,
        affiliateId: process.env.NEXT_PUBLIC_BOOKBOLT_AFFILIATE_ID || '',
      },
      canva: {
        enabled: !!process.env.NEXT_PUBLIC_CANVA_AFFILIATE_ID,
        affiliateId: process.env.NEXT_PUBLIC_CANVA_AFFILIATE_ID || '',
      },
    },

    tracking: {
      cookieDurationDays: parseInt(process.env.AFFILIATE_COOKIE_DAYS || '30', 10),
      sessionDurationMinutes: parseInt(process.env.AFFILIATE_SESSION_MINUTES || '30', 10),
      pixelEnabled: process.env.AFFILIATE_PIXEL_ENABLED !== 'false',
      webhookEndpoint: process.env.AFFILIATE_WEBHOOK_ENDPOINT || '/api/affiliate/track',
    },

    disclosure: {
      showOnAllLinks: process.env.AFFILIATE_SHOW_DISCLOSURE !== 'false',
      disclosureText: process.env.AFFILIATE_DISCLOSURE_TEXT ||
        'Affiliate link - we may earn a commission if you make a purchase.',
      disclosurePage: '/disclosure',
    },
  };
}

// Export singleton config instance
let configInstance: AffiliateConfig | null = null;

export function getAffiliateConfig(): AffiliateConfig {
  if (!configInstance) {
    configInstance = loadAffiliateConfig();
  }
  return configInstance;
}

// Validation helper
export function validateConfig(config: AffiliateConfig): string[] {
  const errors: string[] = [];

  if (config.enabled) {
    // Check if at least one program is enabled
    const hasEnabledProgram =
      config.amazon.enabled ||
      config.shareasale.enabled ||
      Object.values(config.programs).some((p) => p.enabled);

    if (!hasEnabledProgram) {
      errors.push('Affiliate system enabled but no programs configured');
    }

    // Check Amazon config
    if (config.amazon.enabled && !config.amazon.associateTag) {
      errors.push('Amazon Associates enabled but NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG not set');
    }

    // Check ShareASale config
    if (config.shareasale.enabled && !config.shareasale.affiliateId) {
      errors.push('ShareASale enabled but SHAREASALE_AFFILIATE_ID not set');
    }
  }

  return errors;
}

// Determine if affiliate link should be shown
export function shouldShowAffiliateLink(
  programId: string,
  config: AffiliateConfig = getAffiliateConfig()
): boolean {
  if (!config.enabled) return false;

  switch (programId) {
    case 'amazon':
      return config.amazon.enabled;
    case 'shareasale':
      return config.shareasale.enabled;
    default:
      return config.programs[programId]?.enabled || false;
  }
}

// Get affiliate ID for a program
export function getAffiliateId(
  programId: string,
  config: AffiliateConfig = getAffiliateConfig()
): string {
  switch (programId) {
    case 'amazon':
      return config.amazon.associateTag;
    case 'shareasale':
      return config.shareasale.affiliateId;
    default:
      return config.programs[programId]?.affiliateId || '';
  }
}
