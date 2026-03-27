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
import { X, Play, Gift, CheckCircle, Volume2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  isAdSdkAvailable,
  RewardedAdModule,
  AdEventType,
  RewardedAdEventType,
  AD_UNIT_IDS,
} from '@/constants/ads';

const REWARDED_ADS = [
  {
    headline: 'Vola verso nuove avventure!',
    body: 'Scopri le offerte esclusive per viaggiatori smart. Risparmia fino al 50% sui voli.',
    sponsor: 'TravelDeals',
    gradient: ['#0D47A1', '#1565C0', '#1E88E5'] as [string, string, string],
    duration: 5,
  },
  {
    headline: 'Assicurazione viaggio completa',
    body: 'Proteggi il tuo viaggio con la copertura totale. Assistenza 24/7 in tutto il mondo.',
    sponsor: 'SafeTravel',
    gradient: ['#1B5E20', '#2E7D32', '#43A047'] as [string, string, string],
    duration: 5,
  },
  {
    headline: 'Hotel & Resort Premium',
    body: 'Soggiorni esclusivi nelle migliori strutture. Prenota ora con sconto speciale.',
    sponsor: 'LuxStay',
    gradient: ['#BF360C', '#D84315', '#F4511E'] as [string, string, string],
    duration: 5,
  },
];

interface AdRewardedProps {
  visible: boolean;
  onClose: () => void;
  onRewardEarned: () => void;
  utilityName?: string;
}

function FallbackRewarded({ visible, onClose, onRewardEarned, utilityName }: AdRewardedProps) {
  const [adIndex] = useState(() => Math.floor(Math.random() * REWARDED_ADS.length));
  const [phase, setPhase] = useState<'loading' | 'playing' | 'completed'>('loading');
  const [countdown, setCountdown] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  const ad = REWARDED_ADS[adIndex];

  useEffect(() => {
    if (visible) {
      setPhase('loading');
      setCountdown(ad.duration);
      progressAnim.setValue(0);
      checkAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 40, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      const loadTimer = setTimeout(() => {
        setPhase('playing');
        setCountdown(ad.duration);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        Animated.timing(progressAnim, {
          toValue: 1,
          duration: ad.duration * 1000,
          useNativeDriver: false,
        }).start();

        const interval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setPhase('completed');
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

              Animated.spring(checkAnim, {
                toValue: 1,
                friction: 4,
                tension: 50,
                useNativeDriver: true,
              }).start();

              Animated.loop(
                Animated.sequence([
                  Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
                  Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
              ).start();

              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      }, 1200);

      return () => clearTimeout(loadTimer);
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
      progressAnim.setValue(0);
      pulseAnim.setValue(1);
      checkAnim.setValue(0);
    }
  }, [visible]);

  const handleCollectReward = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 250, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      onRewardEarned();
      onClose();
    });
  }, [onRewardEarned, onClose]);

  const handleSkip = useCallback(() => {
    if (phase === 'playing') return;
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 200, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  }, [phase, onClose]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={ad.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardInner}
          >
            <View style={styles.topBar}>
              <View style={styles.adTag}>
                <Volume2 color="rgba(255,255,255,0.7)" size={10} />
                <Text style={styles.adTagText}>Video Sponsorizzato</Text>
              </View>
              {phase !== 'playing' && (
                <TouchableOpacity
                  onPress={handleSkip}
                  style={styles.closeBtn}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <X color="rgba(255,255,255,0.8)" size={16} />
                </TouchableOpacity>
              )}
            </View>

            {phase === 'loading' && (
              <View style={styles.phaseContainer}>
                <View style={styles.loadingCircle}>
                  <Play color="#FFF" size={32} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.loadingText}>Caricamento video...</Text>
                <Text style={styles.loadingSubtext}>Preparazione annuncio</Text>
              </View>
            )}

            {phase === 'playing' && (
              <View style={styles.phaseContainer}>
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.sponsorName}>{ad.sponsor}</Text>
                  <Text style={styles.adHeadline}>{ad.headline}</Text>
                  <Text style={styles.adBody}>{ad.body}</Text>
                </View>

                <View style={styles.countdownRow}>
                  <Text style={styles.countdownLabel}>Il video termina tra</Text>
                  <View style={styles.countdownBadge}>
                    <Text style={styles.countdownNum}>{countdown}</Text>
                  </View>
                </View>

                <View style={styles.progressBarBg}>
                  <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
                </View>

                <Text style={styles.rewardHint}>
                  Guarda fino alla fine per sbloccare {utilityName ?? 'la utility'}
                </Text>
              </View>
            )}

            {phase === 'completed' && (
              <View style={styles.phaseContainer}>
                <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkAnim }] }]}>
                  <CheckCircle color="#FFF" size={56} />
                </Animated.View>
                <Text style={styles.completedTitle}>Video Completato!</Text>
                <Text style={styles.completedSubtitle}>
                  Hai sbloccato {utilityName ?? 'la utility premium'}
                </Text>

                <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%', alignItems: 'center' as const }}>
                  <TouchableOpacity
                    style={styles.rewardBtn}
                    onPress={handleCollectReward}
                    activeOpacity={0.85}
                    testID="collect-reward-btn"
                  >
                    <Gift color={ad.gradient[0]} size={20} />
                    <Text style={[styles.rewardBtnText, { color: ad.gradient[0] }]}>
                      Riscatta Ricompensa
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export default function AdRewarded({ visible, onClose, onRewardEarned, utilityName }: AdRewardedProps) {
  const [useFallback, setUseFallback] = useState(false);
  const adRef = useRef<any>(null);
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (!isAdSdkAvailable() || !RewardedAdModule || Platform.OS === 'web') {
      console.log('[AdRewarded] SDK not available, using fallback');
      setUseFallback(true);
      return;
    }

    try {
      const rewarded = RewardedAdModule.createForAdRequest(AD_UNIT_IDS.REWARDED, {
        requestNonPersonalizedAdsOnly: false,
      });

      const unsubLoaded = rewarded.addAdEventListener(AdEventType.LOADED, () => {
        console.log('[AdRewarded] Real ad loaded');
      });

      const unsubEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward: any) => {
        console.log('[AdRewarded] Reward earned:', reward);
        onRewardEarned();
      });

      const unsubClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('[AdRewarded] Real ad closed');
        hasShownRef.current = false;
        onClose();
        rewarded.load();
      });

      const unsubError = rewarded.addAdEventListener(AdEventType.ERROR, (error: any) => {
        console.log('[AdRewarded] Real ad error, falling back:', error);
        setUseFallback(true);
      });

      adRef.current = rewarded;
      rewarded.load();

      return () => {
        unsubLoaded();
        unsubEarned();
        unsubClosed();
        unsubError();
      };
    } catch (e) {
      console.log('[AdRewarded] Failed to create ad, using fallback:', e);
      setUseFallback(true);
    }
  }, []);

  useEffect(() => {
    if (visible && adRef.current && !useFallback && !hasShownRef.current) {
      if (adRef.current.loaded) {
        console.log('[AdRewarded] Showing real ad');
        hasShownRef.current = true;
        adRef.current.show();
      } else {
        console.log('[AdRewarded] Real ad not loaded yet, using fallback');
        setUseFallback(true);
      }
    }
  }, [visible, useFallback]);

  if (useFallback) {
    return (
      <FallbackRewarded
        visible={visible}
        onClose={onClose}
        onRewardEarned={onRewardEarned}
        utilityName={utilityName}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  cardInner: {
    padding: 24,
    minHeight: 420,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  adTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adTagText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFF',
    marginBottom: 6,
  },
  loadingSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  videoPlaceholder: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  sponsorName: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
    marginBottom: 12,
  },
  adHeadline: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  adBody: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  countdownLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  countdownBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNum: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#FFF',
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  rewardHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    fontStyle: 'italic' as const,
  },
  checkCircle: {
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  rewardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  rewardBtnText: {
    fontSize: 16,
    fontWeight: '800' as const,
  },
});
