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

const MobileAds: any = null;
const BannerAdComponent: any = null;
const BannerAdSize: any = null;
const InterstitialAdModule: any = null;
const RewardedAdModule: any = null;
const AdEventType: any = null;
const RewardedAdEventType: any = null;

console.log('[AdMob] react-native-google-mobile-ads not installed, using fallback ads. Install the package and rebuild with EAS for real ads.');

export const isAdSdkAvailable = () => false;

export const initializeAds = async () => {
  console.log('[AdMob] Skipping initialization - SDK not installed. Will work after EAS build with react-native-google-mobile-ads.');
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
