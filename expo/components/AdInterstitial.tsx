import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ExternalLink, Plane, Star } from 'lucide-react-native';
import {
  isAdSdkAvailable,
  InterstitialAdModule,
  AdEventType,
  AD_UNIT_IDS,
} from '@/constants/ads';

const INTERSTITIAL_ADS = [
  {
    headline: 'Scopri le migliori offerte volo!',
    body: 'Risparmia fino al 40% sui voli per le tue destinazioni preferite. Prenota adesso e parti domani.',
    cta: 'Vedi Offerte',
    gradient: ['#0077B6', '#00B4D8'] as [string, string],
    icon: Plane,
  },
  {
    headline: 'Premium Travel Experience',
    body: 'Accedi a lounge esclusive, upgrade gratuiti e assistenza 24/7 per i tuoi viaggi.',
    cta: 'Scopri Premium',
    gradient: ['#7B2D8E', '#B56FD8'] as [string, string],
    icon: Star,
  },
];

interface AdInterstitialProps {
  visible: boolean;
  onClose: () => void;
}

function FallbackInterstitial({ visible, onClose }: AdInterstitialProps) {
  const [adIndex] = useState(() => Math.floor(Math.random() * INTERSTITIAL_ADS.length));
  const [countdown, setCountdown] = useState(3);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const ad = INTERSTITIAL_ADS[adIndex];
  const AdIcon = ad.icon;

  useEffect(() => {
    if (visible) {
      setCountdown(3);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    if (countdown > 0) return;
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={ad.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.topRow}>
              <View style={styles.adBadge}>
                <Text style={styles.adBadgeText}>Sponsorizzato</Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={[styles.closeBtn, countdown > 0 && styles.closeBtnDisabled]}
                activeOpacity={countdown > 0 ? 1 : 0.7}
              >
                {countdown > 0 ? (
                  <Text style={styles.countdownText}>{countdown}</Text>
                ) : (
                  <X color="#FFF" size={18} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.iconCircle}>
              <AdIcon color="#FFF" size={48} />
            </View>

            <Text style={styles.headline}>{ad.headline}</Text>
            <Text style={styles.body}>{ad.body}</Text>

            <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
              <Text style={styles.ctaText}>{ad.cta}</Text>
              <ExternalLink color={ad.gradient[0]} size={16} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export default function AdInterstitial({ visible, onClose }: AdInterstitialProps) {
  const [useFallback, setUseFallback] = useState(false);
  const adRef = useRef<any>(null);
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (!isAdSdkAvailable() || !InterstitialAdModule || Platform.OS === 'web') {
      console.log('[AdInterstitial] SDK not available, using fallback');
      setUseFallback(true);
      return;
    }

    try {
      const interstitial = InterstitialAdModule.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: false,
      });

      const unsubLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        console.log('[AdInterstitial] Real ad loaded');
      });

      const unsubClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('[AdInterstitial] Real ad closed');
        hasShownRef.current = false;
        onClose();
        interstitial.load();
      });

      const unsubError = interstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
        console.log('[AdInterstitial] Real ad error, falling back:', error);
        setUseFallback(true);
      });

      adRef.current = interstitial;
      interstitial.load();

      return () => {
        unsubLoaded();
        unsubClosed();
        unsubError();
      };
    } catch (e) {
      console.log('[AdInterstitial] Failed to create ad, using fallback:', e);
      setUseFallback(true);
    }
  }, []);

  useEffect(() => {
    if (visible && adRef.current && !useFallback && !hasShownRef.current) {
      if (adRef.current.loaded) {
        console.log('[AdInterstitial] Showing real ad');
        hasShownRef.current = true;
        adRef.current.show();
      } else {
        console.log('[AdInterstitial] Real ad not loaded yet, using fallback');
        setUseFallback(true);
      }
    }
  }, [visible, useFallback]);

  if (useFallback) {
    return <FallbackInterstitial visible={visible} onClose={onClose} />;
  }

  return null;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  cardGradient: {
    padding: 28,
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  adBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#FFF',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  body: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1C1C1E',
  },
});
