import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plane, Camera, Compass, Map, Briefcase, Globe, Wrench, BookOpen, ChevronRight, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAppState } from '@/hooks/useAppState';
import AdBanner from '@/components/AdBanner';

const { width } = Dimensions.get('window');

const HERO_IMAGE = 'https://r2-pub.rork.com/generated-images/878a716d-b350-4421-b5f2-477de0e651ca.png';
const CARD_IMG_TRIPS = 'https://r2-pub.rork.com/generated-images/02347b58-772d-4258-a89f-ff09aefb9fdc.png';
const CARD_IMG_UTILITY = 'https://r2-pub.rork.com/generated-images/b9b462bd-6155-4078-85b0-bd2f486c0fad.png';
const CARD_IMG_DIARY = 'https://r2-pub.rork.com/generated-images/d1964fe0-5dc5-4248-9ebe-241e0fb1abd5.png';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAppState();

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const floatAnim4 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeInCards = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const createFloat = (anim: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -10, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
        ])
      );
    createFloat(floatAnim1, 2200).start();
    createFloat(floatAnim2, 2700).start();
    createFloat(floatAnim3, 1900).start();
    createFloat(floatAnim4, 2400).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(fadeInCards, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleStartQuiz = () => {
    if (profile) {
      router.push('/(tabs)/(home)/results' as any);
    } else {
      router.push('/(tabs)/(home)/quiz' as any);
    }
  };

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <View style={styles.heroWrapper}>
        <ImageBackground
          source={{ uri: HERO_IMAGE }}
          style={[styles.heroBg, { paddingTop: insets.top + 16 }]}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(77,208,225,0.55)', 'rgba(92,138,230,0.7)', 'rgba(123,104,238,0.82)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroOverlay}
          >
            <View style={styles.iconRow}>
              <Animated.View style={[styles.floatingIcon, { transform: [{ translateY: floatAnim1 }] }]}>
                <View style={styles.iconBubble}>
                  <Plane color="#fff" size={20} />
                </View>
              </Animated.View>
              <Animated.View style={[styles.floatingIcon, { transform: [{ translateY: floatAnim2 }] }]}>
                <View style={styles.iconBubble}>
                  <Camera color="#fff" size={18} />
                </View>
              </Animated.View>
              <Animated.View style={[styles.floatingIcon, { transform: [{ translateY: floatAnim3 }] }]}>
                <View style={styles.iconBubble}>
                  <Compass color="#fff" size={20} />
                </View>
              </Animated.View>
              <Animated.View style={[styles.floatingIcon, { transform: [{ translateY: floatAnim4 }] }]}>
                <View style={styles.iconBubble}>
                  <Map color="#fff" size={18} />
                </View>
              </Animated.View>
            </View>

            <View style={styles.heroTextBlock}>
              <View style={styles.brandPill}>
                <Sparkles color="#FFD700" size={12} />
                <Text style={styles.appName}>WANDERLY</Text>
              </View>
              <Text style={styles.heroTitle}>Che viaggiatore{"\n"}sei?</Text>
              <Text style={styles.heroSub}>Scopri il tuo profilo di viaggio e le destinazioni perfette per te</Text>
            </View>

            <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%', alignItems: 'center' as const }}>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={handleStartQuiz}
                activeOpacity={0.85}
                testID="start-quiz-btn"
              >
                <LinearGradient
                  colors={['#FF8A80', '#FF5252']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaText}>
                    {profile ? 'Vedi il tuo profilo' : 'Scopri il tuo profilo'}
                  </Text>
                  <ChevronRight color="#fff" size={20} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <Animated.View style={[styles.cardsSection, { opacity: fadeInCards, transform: [{ translateY: slideUp }] }]}>
        <Text style={styles.sectionLabel}>Esplora</Text>

        <TouchableOpacity
          style={styles.featureCard}
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/trips' as any)}
        >
          <LinearGradient
            colors={['#4DD0E1', '#00ACC1']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardTextCol}>
                <View style={styles.cardIconRow}>
                  <View style={styles.cardIconBg}>
                    <Briefcase color={Colors.white} size={18} />
                  </View>
                  <View style={styles.cardIconBg}>
                    <Globe color={Colors.white} size={16} />
                  </View>
                </View>
                <Text style={styles.cardTitle}>I Miei Viaggi</Text>
                <Text style={styles.cardDesc}>Pianifica e organizza le tue prossime avventure</Text>
              </View>
              <Image source={{ uri: CARD_IMG_TRIPS }} style={styles.cardImage} resizeMode="contain" />
            </View>
            <View style={styles.cardArrow}>
              <ChevronRight color="rgba(255,255,255,0.6)" size={20} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/utilities' as any)}
        >
          <LinearGradient
            colors={['#7B68EE', '#5C4FCF']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardTextCol}>
                <View style={styles.cardIconRow}>
                  <View style={styles.cardIconBg}>
                    <Wrench color={Colors.white} size={18} />
                  </View>
                </View>
                <Text style={styles.cardTitle}>Utility</Text>
                <Text style={styles.cardDesc}>Traduci, converti valute, meteo e molto altro</Text>
              </View>
              <Image source={{ uri: CARD_IMG_UTILITY }} style={styles.cardImage} resizeMode="contain" />
            </View>
            <View style={styles.cardArrow}>
              <ChevronRight color="rgba(255,255,255,0.6)" size={20} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/(home)/diary' as any)}
        >
          <LinearGradient
            colors={['#FF8A80', '#E85D4A']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardTextCol}>
                <View style={styles.cardIconRow}>
                  <View style={styles.cardIconBg}>
                    <BookOpen color={Colors.white} size={18} />
                  </View>
                </View>
                <Text style={styles.cardTitle}>Diario</Text>
                <Text style={styles.cardDesc}>Annota e organizza le tue esperienze di viaggio</Text>
              </View>
              <Image source={{ uri: CARD_IMG_DIARY }} style={styles.cardImage} resizeMode="contain" />
            </View>
            <View style={styles.cardArrow}>
              <ChevronRight color="rgba(255,255,255,0.6)" size={20} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <AdBanner style={{ marginHorizontal: 20, marginTop: 16, marginBottom: 0 }} />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  heroWrapper: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroBg: {
    width: '100%',
  },
  heroOverlay: {
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 16,
    marginBottom: 20,
  },
  floatingIcon: {
    padding: 4,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  appName: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700' as const,
    letterSpacing: 3,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800' as const,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 16,
  },
  ctaButton: {
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 50,
  },
  ctaText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardsSection: {
    paddingHorizontal: 20,
    paddingTop: 22,
    gap: 12,
  },
  featureCard: {
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  cardIconRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  cardIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  cardImage: {
    width: 74,
    height: 74,
    borderRadius: 14,
  },
  cardArrow: {
    position: 'absolute',
    right: 18,
    bottom: 18,
  },
});
