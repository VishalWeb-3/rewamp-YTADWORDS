// What each product page does when you buy, copied from the existing Buy*Page components so the imported
// revamp pages behave the same: cart item fields, the Get started hand-off, and which CTA switches apply.
// Packages come from Tina (content/pricing) through usePricingPackages; feature lists and banners are the revamp's.

const FEATURES = (noun) => [`Real & Organic ${noun}`, 'High Quality', 'Instant start', 'Refill Guaranteed', 'No drops', 'Privacy and safety'];

export const SERVICES = {
  'buy-youtube-views': {
    serviceType: 'YouTube Views', platform: 'YouTube', quantityKey: 'views', unitLabel: 'views',
    tabs: { regular: 'Regular Views', fast: 'Fast Views', ads: 'Ads Views' }, tinaTabs: true,
    cartTypes: { regular: 'Regular Views', fast: 'Fast Views', ads: 'Ads Views' },
    buy: 'checkout', ctaSwitches: true,
    features: FEATURES('Views'), banner: 'We recommend our Fast YouTube Views packages for orders with a high number of views.',
  },
  'buy-youtube-subscribers': {
    serviceType: 'YouTube Subscribers', platform: 'YouTube', quantityKey: 'subscribers', unitLabel: 'subs',
    tabs: { regular: 'Regular Subs.', fast: 'Natural Growth', ads: 'Influencer+' }, tinaTabs: true,
    cartTypes: { regular: 'Regular Subs.', fast: 'Natural Growth', ads: 'Influencer+' },
    startLabels: { regular: 'Regular Subs.', fast: 'Natural Growth', ads: 'Influencer+' },
    buy: 'get-started', ctaSwitches: true,
    features: FEATURES('Subscribers'), banner: 'We recommend our Natural Growth packages for orders with a high number of subscribers.',
  },
  'buy-youtube-likes': {
    serviceType: 'YouTube Likes', platform: 'YouTube', quantityKey: 'likes', unitLabel: 'likes',
    tabs: { regular: 'Slow Likes', fast: 'Turbo Likes' }, tinaTabs: true,
    cartTypes: { regular: 'Slow Likes', fast: 'Turbo Likes' },
    startLabels: { regular: 'Slow Likes', fast: 'Turbo Likes' },
    buy: 'get-started', ctaSwitches: true,
    features: FEATURES('Likes'), banner: 'We recommend our Turbo YouTube Likes packages for orders with a high number of likes.',
  },
  'buy-youtube-watch-hours': {
    serviceType: 'YouTube Watch Hours', platform: 'YouTube', quantityKey: 'hours', unitLabel: 'hours',
    tabs: { regular: 'Watch Time' },
    cartTypes: { regular: 'Watch Time', fast: 'Watch Time', ads: 'Watch Time' },
    startLabels: { regular: 'Watch Time' },
    buy: 'get-started', ctaSwitches: false,
    features: FEATURES('Watch Hours'), banner: 'We recommend our Verified YouTube Watch Hours packages to boost your channel toward monetisation.',
  },
  'buy-google-skip-ads-views': {
    serviceType: 'Google Skip Ads Views', quantityKey: 'views', unitLabel: 'views',
    tabs: { regular: 'Regular Views' }, onlyRegular: true,
    cartTypes: { regular: 'Regular Views', fast: 'Fast Views', ads: 'Ads Views' },
    startLabels: { regular: 'Regular Views' },
    buy: 'get-started', contactForPrice: true, ctaSwitches: false,
    features: FEATURES('Skip Ads Views'),
  },
  'buy-google-display-ads-views': {
    serviceType: 'Google Display Ads Views', quantityKey: 'views', unitLabel: 'views',
    tabs: { regular: 'Content Targeted Setup', fast: 'Worldwide (WW) Display', ads: 'Country Targeted Display' },
    cartTypes: { regular: 'Regular Views', fast: 'Fast Views', ads: 'Ads Views' },
    startLabels: { regular: 'Content Targeted Setup', fast: 'Worldwide (WW) Display', ads: 'Country Targeted Display' },
    buy: 'get-started', contactForPrice: true, ctaSwitches: false,
    features: FEATURES('Display Ads Views'),
  },
  'buy-google-apps-download': {
    serviceType: 'Google Apps Download', quantityKey: 'installs', unitLabel: 'installs',
    tabs: { regular: 'Worldwide (WW) Installs', fast: 'Tier-1 Country Installs (USA, UK, Canada, etc.)' },
    cartTypes: { regular: 'Worldwide (WW) Installs', fast: 'Tier-1 Country Installs (USA, UK, Canada, etc.)' },
    startLabels: { regular: 'Worldwide (WW) Installs', fast: 'Tier-1 Country Installs (USA, UK, Canada, etc.)' },
    buy: 'get-started', contactForPrice: true, ctaSwitches: false,
    features: FEATURES('App Installs'),
  },
  'buy-google-ads-website-traffic': {
    serviceType: 'Google Ads Website Traffic', quantityKey: 'traffic', unitLabel: 'traffic',
    tabs: { regular: 'Regular' }, onlyRegular: true,
    cartTypes: { regular: 'Regular', fast: 'Fast', ads: 'Ads' },
    startLabels: { regular: 'Regular' },
    buy: 'get-started', contactForPrice: true, ctaSwitches: false,
    features: FEATURES('Website Traffic'),
  },
};

export const TIER_KEYS = ['regular', 'fast', 'ads'];
export const isPriced = (pkg) => /^\d+(\.\d+)?$/.test(String(pkg?.price ?? ''));
export const money = (value) => `$${Number(value).toFixed(2)}`;
