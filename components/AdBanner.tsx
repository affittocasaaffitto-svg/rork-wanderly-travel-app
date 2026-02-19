import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { X, ExternalLink, Megaphone } from 'lucide-react-native';
import {
  isAdSdkAvailable,
  BannerAdComponent,
  BannerAdSize,
  AD_UNIT_IDS,
} from '@/constants/ads';

const AD_CONTENT = [
  { headline: 'Prenota il tuo volo ora!', body: 'Offerte esclusive per viaggiatori', cta: 'Scopri', color: '#0077B6' },
  { headline: 'Hotel a partire da 39€', body: 'Le migliori tariffe garantite', cta: 'Prenota', color: '#E07A2F' },
  { headline: 'Assicurazione viaggio', body: 'Viaggia protetto ovunque vai', cta: 'Info', color: '#2D6A4F' },
  { headline: 'Noleggio auto -30%', body: 'Risparmia sul tuo prossimo viaggio', cta: 'Offerta', color: '#7B2D8E' },
  { headline: 'Guide turistiche gratis', body: 'Scarica le guide delle città top', cta: 'Scarica', color: '#C1121F' },
];

interface AdBannerProps {
  style?: object;
}

function FallbackBanner({ style }: AdBannerProps) {
  const [adIndex] = useState(() => Math.floor(Math.random() * AD_CONTENT.length));
  const [dismissed, setDismissed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const ad = AD_CONTENT[adIndex];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  if (dismissed) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }, style]}>
      <View style={[styles.adBar, { borderLeftColor: ad.color }]}>
        <View style={styles.adLabelRow}>
          <View style={styles.adBadge}>
            <Megaphone color="#8E8E93" size={10} />
            <Text style={styles.adLabel}>Ad</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }).start(() => setDismissed(true));
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X color="#C7C7CC" size={14} />
          </TouchableOpacity>
        </View>
        <View style={styles.adContent}>
          <View style={styles.adTextCol}>
            <Text style={styles.adHeadline} numberOfLines={1}>{ad.headline}</Text>
            <Text style={styles.adBody} numberOfLines={1}>{ad.body}</Text>
          </View>
          <TouchableOpacity style={[styles.adCta, { backgroundColor: ad.color }]} activeOpacity={0.8}>
            <Text style={styles.adCtaText}>{ad.cta}</Text>
            <ExternalLink color="#FFF" size={12} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export default function AdBanner({ style }: AdBannerProps) {
  const [adError, setAdError] = useState(false);

  if (isAdSdkAvailable() && BannerAdComponent && Platform.OS !== 'web' && !adError) {
    console.log('[AdBanner] Rendering real AdMob banner');
    return (
      <View style={[styles.container, style]}>
        <BannerAdComponent
          unitId={AD_UNIT_IDS.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          onAdFailedToLoad={(error: any) => {
            console.log('[AdBanner] Failed to load real ad, falling back:', error);
            setAdError(true);
          }}
          onAdLoaded={() => {
            console.log('[AdBanner] Real ad loaded successfully');
          }}
        />
      </View>
    );
  }

  return <FallbackBanner style={style} />;
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  adBar: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderLeftWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  adLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  adBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EBEBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adLabel: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: '#8E8E93',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adTextCol: {
    flex: 1,
    marginRight: 10,
  },
  adHeadline: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#1C1C1E',
    marginBottom: 2,
  },
  adBody: {
    fontSize: 12,
    color: '#8E8E93',
  },
  adCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adCtaText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#FFF',
  },
});
