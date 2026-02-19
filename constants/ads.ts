import { Platform } from 'react-native';

export const ADMOB_APP_ID = 'ca-app-pub-6485359070561655~3433593210';

export const AD_UNIT_IDS = {
  REWARDED: Platform.select({
    ios: 'ca-app-pub-6485359070561655/7668351692',
    android: 'ca-app-pub-6485359070561655/7668351692',
    default: 'ca-app-pub-6485359070561655/7668351692',
  }),
  BANNER: Platform.select({
    ios: 'ca-app-pub-6485359070561655/7668351692',
    android: 'ca-app-pub-6485359070561655/7668351692',
    default: 'ca-app-pub-6485359070561655/7668351692',
  }),
  INTERSTITIAL: Platform.select({
    ios: 'ca-app-pub-6485359070561655/7668351692',
    android: 'ca-app-pub-6485359070561655/7668351692',
    default: 'ca-app-pub-6485359070561655/7668351692',
  }),
};

let MobileAds: any = null;
let BannerAdComponent: any = null;
let BannerAdSize: any = null;
let InterstitialAdModule: any = null;
let RewardedAdModule: any = null;
let AdEventType: any = null;
let RewardedAdEventType: any = null;

let sdkAvailable = false;

try {
  const gma = require('react-native-google-mobile-ads');
  MobileAds = gma.default;
  BannerAdComponent = gma.BannerAd;
  BannerAdSize = gma.BannerAdSize;
  InterstitialAdModule = gma.InterstitialAd;
  RewardedAdModule = gma.RewardedAd;
  AdEventType = gma.AdEventType;
  RewardedAdEventType = gma.RewardedAdEventType;
  sdkAvailable = true;
  console.log('[AdMob] SDK loaded successfully');
} catch (e) {
  console.log('[AdMob] SDK not available, using fallback ads');
  sdkAvailable = false;
}

export const isAdSdkAvailable = () => sdkAvailable;

export const initializeAds = async () => {
  if (!sdkAvailable || !MobileAds) {
    console.log('[AdMob] Skipping initialization - SDK not available');
    return;
  }
  try {
    await MobileAds().initialize();
    console.log('[AdMob] Initialized successfully');
  } catch (e) {
    console.log('[AdMob] Initialization error:', e);
  }
};

export {
  MobileAds,
  BannerAdComponent,
  BannerAdSize,
  InterstitialAdModule,
  RewardedAdModule,
  AdEventType,
  RewardedAdEventType,
};
