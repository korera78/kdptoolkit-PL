/**
 * AdSense Components Index
 * Central export for all AdSense-related components
 */

// Core component
export { default as AdUnit } from './AdUnit';

// Pre-configured placements
export {
  HeaderLeaderboardAd,
  SidebarRectangleAd,
  InContentAd,
  FooterHorizontalAd,
  MultiplexAd,
  CustomAd,
  StickySidebarAd,
} from './AdPlacements';

// Configuration
export {
  ADSENSE_CLIENT_ID,
  AD_SLOTS,
  AD_PLACEMENTS,
  LAZY_LOAD_CONFIG,
  isAdsEnabled,
  type AdFormat,
  type AdPlacementConfig,
} from './adsense.config';
