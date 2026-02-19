import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Sparkles, Lock, Play, Crown } from 'lucide-react-native';
import Colors from '@/constants/colors';
import AdBanner from '@/components/AdBanner';
import AdRewarded from '@/components/AdRewarded';
import { useAppState } from '@/hooks/useAppState';

const { width } = Dimensions.get('window');

const IMG_CHECKLIST = 'https://r2-pub.rork.com/generated-images/6ea74c37-4d4f-4faf-97de-05affa98959f.png';
const IMG_PHRASEBOOK = 'https://r2-pub.rork.com/generated-images/a13c2db4-7223-4423-8321-0a1c10945af1.png';
const IMG_TRANSLATOR = 'https://r2-pub.rork.com/generated-images/80e16f45-7327-4f53-8d2f-cd8d096b8674.png';
const IMG_CONVERTER = 'https://r2-pub.rork.com/generated-images/bfe61ec5-dd7e-4908-b6e0-25b7847d2787.png';
const IMG_WEATHER = 'https://r2-pub.rork.com/generated-images/35e198e3-0a5c-47fc-956b-3d1c86585ec9.png';
const IMG_EMERGENCY = 'https://r2-pub.rork.com/generated-images/4c7cdae2-fbd5-4530-bcfb-72b8d9ff3bdc.png';
const IMG_TIPS = 'https://r2-pub.rork.com/generated-images/ae3c52ac-1fc4-41a3-af2b-29519ede6f8d.png';
const IMG_TIMEZONE = 'https://r2-pub.rork.com/generated-images/9676e764-dfe6-4581-afe3-689829156e64.png';
const IMG_BUDGET = 'https://r2-pub.rork.com/generated-images/05dbbf9e-a237-4ab2-9c6a-eed2958bd7fc.png';
const IMG_UNITS = 'https://r2-pub.rork.com/generated-images/b1029995-e19a-43db-bea8-106f3187ace7.png';
const IMG_WIFI = 'https://r2-pub.rork.com/generated-images/c9336c07-0146-4d4f-82f2-50e8f1f067e5.png';
const IMG_FLIGHTS = 'https://r2-pub.rork.com/generated-images/7a044138-0aa5-427b-9ed2-3a43c3e844bb.png';
const IMG_SCAN = 'https://r2-pub.rork.com/generated-images/863d519a-a9e0-4499-ad38-4de41caf7e12.png';
const IMG_OFFLINE_MAPS = 'https://r2-pub.rork.com/generated-images/fcab13fe-771c-4d1b-ae51-8e88e28160fd.png';
const IMG_VACCINES = 'https://r2-pub.rork.com/generated-images/f204e3ea-8d83-4856-a1ce-d20d783dfd06.png';
const IMG_MENU_TRANSLATOR = 'https://r2-pub.rork.com/generated-images/987bc612-8c00-4c09-aaf4-a13b954eac5e.png';
const IMG_POWER_ADAPTERS = 'https://r2-pub.rork.com/generated-images/5ad3ef13-90a2-45ee-a3a5-639116be13f8.png';

interface UtilityItem {
  id: string;
  title: string;
  description: string;
  image: string;
  gradient: [string, string];
  route: string;
  premium?: boolean;
}

const PREMIUM_IDS = ['u3', 'u14', 'u12', 'u9', 'u11'];

const ALL_UTILITIES: UtilityItem[] = [
  { id: 'u3', title: 'Traduttore Live', description: 'Traduci testi in tempo reale con AI', image: IMG_TRANSLATOR, gradient: ['#E8443A', '#C62828'], route: '/(tabs)/utilities/translator', premium: true },
  { id: 'u1', title: 'Checklist Valigia', description: 'Non dimenticare nulla per il viaggio', image: IMG_CHECKLIST, gradient: ['#00897B', '#00695C'], route: '/(tabs)/utilities/checklist' },
  { id: 'u14', title: 'Scansiona Documenti', description: 'Scansiona passaporto e carta ID', image: IMG_SCAN, gradient: ['#0277BD', '#01579B'], route: '/(tabs)/utilities/scan', premium: true },
  { id: 'u6', title: 'SOS Emergenza', description: 'Numeri utili e contatti di emergenza', image: IMG_EMERGENCY, gradient: ['#D32F2F', '#B71C1C'], route: '/(tabs)/utilities/emergency' },
  { id: 'u12', title: 'Stato Voli', description: 'Traccia i tuoi voli in tempo reale', image: IMG_FLIGHTS, gradient: ['#00838F', '#006064'], route: '/(tabs)/utilities/flights', premium: true },
  { id: 'u2', title: 'Frasario Viaggio', description: 'Frasi essenziali per ogni destinazione', image: IMG_PHRASEBOOK, gradient: ['#5E35B1', '#4527A0'], route: '/(tabs)/utilities/phrasebook' },
  { id: 'u4', title: 'Convertitore Valuta', description: 'Cambia valuta al volo ovunque', image: IMG_CONVERTER, gradient: ['#00ACC1', '#00838F'], route: '/(tabs)/utilities/converter' },
  { id: 'u5', title: 'Meteo e Clima', description: 'Previsioni meteo per la tua destinazione', image: IMG_WEATHER, gradient: ['#1976D2', '#1565C0'], route: '/(tabs)/utilities/weather' },
  { id: 'u7', title: 'Calcolatore Mancia', description: 'Calcola la mancia giusta ovunque', image: IMG_TIPS, gradient: ['#EF6C00', '#E65100'], route: '/(tabs)/utilities/tips' },
  { id: 'u8', title: 'Fusi Orari', description: 'Confronta gli orari nel mondo', image: IMG_TIMEZONE, gradient: ['#283593', '#1A237E'], route: '/(tabs)/utilities/timezone' },
  { id: 'u9', title: 'Budget Viaggio', description: 'Controlla e gestisci le spese', image: IMG_BUDGET, gradient: ['#00897B', '#00695C'], route: '/(tabs)/utilities/budget', premium: true },
  { id: 'u10', title: 'Convertitore Unità', description: 'Miglia, libbre, gradi e molto altro', image: IMG_UNITS, gradient: ['#388E3C', '#2E7D32'], route: '/(tabs)/utilities/units' },
  { id: 'u11', title: 'Password WiFi', description: 'Salva e gestisci le reti WiFi', image: IMG_WIFI, gradient: ['#37474F', '#263238'], route: '/(tabs)/utilities/wifi', premium: true },
  { id: 'u15', title: 'Mappe Offline', description: 'Scarica mappe per navigare senza internet', image: IMG_OFFLINE_MAPS, gradient: ['#1B5E20', '#43A047'], route: '/(tabs)/utilities/offline-maps' },
  { id: 'u16', title: 'Vaccini & Salute', description: 'Info sanitarie per ogni destinazione', image: IMG_VACCINES, gradient: ['#C62828', '#EF5350'], route: '/(tabs)/utilities/vaccines' },
  { id: 'u17', title: 'Traduttore Menu', description: 'Traduci menu e identifica allergeni', image: IMG_MENU_TRANSLATOR, gradient: ['#4A148C', '#8E24AA'], route: '/(tabs)/utilities/menu-translator' },
  { id: 'u18', title: 'Adattatori & Tensione', description: 'Prese elettriche e adattatori per paese', image: IMG_POWER_ADAPTERS, gradient: ['#E65100', '#FFB300'], route: '/(tabs)/utilities/power-adapters' },
];

function HorizontalCard({ item, onPress, index, locked, onUnlock }: {
  item: UtilityItem;
  onPress: () => void;
  index: number;
  locked: boolean;
  onUnlock: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 70, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 70, useNativeDriver: true, tension: 50, friction: 8 }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] }]}>
      <TouchableOpacity
        onPress={locked ? onUnlock : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        testID={`utility-${item.id}`}
      >
        <LinearGradient colors={item.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradient}>
          {locked && <View style={styles.lockedOverlay} />}
          <View style={styles.cardContent}>
            <View style={styles.cardTextCol}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.premium && !locked && (
                  <View style={styles.unlockedBadge}>
                    <Crown color="#FFD700" size={10} />
                  </View>
                )}
              </View>
              <Text style={styles.cardDesc}>{item.description}</Text>
              {locked && (
                <View style={styles.watchVideoBtn}>
                  <Play color="#FFF" size={12} fill="#FFF" />
                  <Text style={styles.watchVideoText}>Guarda video per sbloccare</Text>
                </View>
              )}
            </View>
            <View style={styles.cardImageWrapper}>
              <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
              {locked && (
                <View style={styles.lockOverlayIcon}>
                  <Lock color="#FFF" size={22} />
                </View>
              )}
            </View>
          </View>
          {!locked && (
            <View style={styles.cardArrow}>
              <ChevronRight color="rgba(255,255,255,0.6)" size={20} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function UtilitiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isUtilityUnlocked, unlockUtility } = useAppState();

  const [adVisible, setAdVisible] = useState(false);
  const [pendingUnlockId, setPendingUnlockId] = useState<string | null>(null);
  const [pendingUnlockName, setPendingUnlockName] = useState<string>('');

  const handlePress = useCallback((route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  }, [router]);

  const handleUnlockRequest = useCallback((item: UtilityItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPendingUnlockId(item.id);
    setPendingUnlockName(item.title);
    setAdVisible(true);
    console.log(`[AdMob Rewarded] Requesting ad for utility: ${item.id} (${item.title})`);
    console.log(`[AdMob Rewarded] Ad Unit ID: ca-app-pub-6485359070561655/7668351692`);
  }, []);

  const handleRewardEarned = useCallback(() => {
    if (pendingUnlockId) {
      console.log(`[AdMob Rewarded] Reward earned! Unlocking utility: ${pendingUnlockId}`);
      unlockUtility(pendingUnlockId);
    }
  }, [pendingUnlockId, unlockUtility]);

  const handleAdClose = useCallback(() => {
    setAdVisible(false);
    setPendingUnlockId(null);
    setPendingUnlockName('');
  }, []);

  const unlockedCount = ALL_UTILITIES.filter(u => !u.premium || isUtilityUnlocked(u.id)).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['rgba(77,208,225,0.55)', 'rgba(92,138,230,0.7)', 'rgba(123,104,238,0.82)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <View style={styles.brandRow}>
              <Sparkles color="#FFD700" size={12} />
              <Text style={styles.brandText}>WANDERLY</Text>
            </View>
            <Text style={styles.headerTitle}>Utility Viaggio</Text>
          </View>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{unlockedCount}/{ALL_UTILITIES.length}</Text>
            <Text style={styles.counterLabel}>sbloccate</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {ALL_UTILITIES.map((item, index) => {
          const locked = item.premium === true && !isUtilityUnlocked(item.id);
          return (
            <HorizontalCard
              key={item.id}
              item={item}
              index={index}
              locked={locked}
              onPress={() => handlePress(item.route)}
              onUnlock={() => handleUnlockRequest(item)}
            />
          );
        })}

        <AdBanner style={{ marginHorizontal: 0, marginTop: 16 }} />
        <View style={{ height: 40 }} />
      </ScrollView>

      <AdRewarded
        visible={adVisible}
        onClose={handleAdClose}
        onRewardEarned={handleRewardEarned}
        utilityName={pendingUnlockName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  brandText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: 3,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  counterBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#fff',
  },
  counterLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.8)',
    marginTop: -2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  cardWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  cardGradient: {
    padding: 18,
    borderRadius: 18,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 18,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  unlockedBadge: {
    backgroundColor: 'rgba(255,215,0,0.25)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  watchVideoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  watchVideoText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  cardImageWrapper: {
    position: 'relative',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },
  lockOverlayIcon: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArrow: {
    position: 'absolute',
    right: 18,
    bottom: 18,
  },
});
