import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Heart, CalendarDays, Coins, ChevronLeft, RefreshCw, Plus,
  TreePalm, Mountain, Building2, Compass, Crown, Backpack,
  Quote, Zap, Users, Briefcase, PawPrint, MapPin, UtensilsCrossed,
  Music, Star,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { profileResults } from '@/constants/quiz';
import { destinations } from '@/constants/destinations';
import { useAppState } from '@/hooks/useAppState';
import AdBanner from '@/components/AdBanner';

const { width } = Dimensions.get('window');

const profileIcons: Record<string, React.ComponentType<{ color: string; size: number }>> = {
  Palmtree: TreePalm, Mountain, Building2, Compass, Crown, Backpack,
};

function StatBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value,
      duration: 1000,
      delay,
      useNativeDriver: false,
    }).start();
  }, [value, delay]);

  const barWidth = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={statStyles.row}>
      <Text style={statStyles.label}>{label}</Text>
      <View style={statStyles.barBg}>
        <Animated.View style={[statStyles.barFill, { width: barWidth, backgroundColor: color }]} />
      </View>
      <Text style={statStyles.value}>{value}%</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 80,
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  value: {
    width: 36,
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    textAlign: 'right' as const,
  },
});

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, resetQuiz, addTrip, trips } = useAppState();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const result = profile ? profileResults[profile] : null;

  const matchedDestinations = useMemo(() => {
    if (!profile) return destinations.slice(0, 3);
    return destinations.filter(d => d.profiles.includes(profile)).slice(0, 4);
  }, [profile]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRetakeQuiz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetQuiz();
    router.replace('/(tabs)/(home)/quiz' as any);
  };

  const handleAddTrip = (dest: typeof destinations[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const alreadyAdded = trips.some(t => t.destination === dest.name);
    if (alreadyAdded) return;
    router.push({
      pathname: '/(tabs)/trips' as any,
      params: {
        prefillName: `Viaggio a ${dest.name}`,
        prefillDest: dest.name,
        prefillImage: dest.image,
        prefillBudget: dest.budget ?? '',
      },
    });
  };

  useEffect(() => {
    if (!result) {
      router.replace('/(tabs)/(home)/quiz' as any);
    }
  }, [result, router]);

  if (!result) {
    return null;
  }

  const ProfileIcon = profileIcons[result.icon];

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: result.image }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)']}
          style={styles.heroOverlay}
        />

        <View style={[styles.heroTopBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ChevronLeft color={Colors.white} size={22} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.heroContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.profileLabel}>Il Tuo Profilo Viaggiatore</Text>
          <Text style={styles.profileTitle}>{result.title}</Text>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <View style={styles.mottoCard}>
          <Quote color={result.color} size={20} />
          <Text style={[styles.mottoText, { color: result.color }]}>{result.motto}</Text>
        </View>

        <View style={styles.descCard}>
          <Text style={styles.descText}>{result.description}</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.sectionHeader}>
            <Zap color={result.color} size={20} />
            <Text style={styles.sectionHeaderText}>Le Tue Stats</Text>
          </View>
          {result.stats.map((stat, i) => (
            <StatBar
              key={stat.label}
              label={stat.label}
              value={stat.value}
              color={result.color}
              delay={i * 150}
            />
          ))}
        </View>

        <View style={styles.detailCard}>
          <View style={styles.sectionHeader}>
            <Zap color={result.color} size={20} />
            <Text style={styles.sectionHeaderText}>I Tuoi Punti di Forza</Text>
          </View>
          {result.strengths.map((strength, i) => (
            <View key={i} style={styles.strengthRow}>
              <View style={[styles.strengthDot, { backgroundColor: result.color }]} />
              <Text style={styles.strengthText}>{strength}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailCard}>
          <View style={styles.sectionHeader}>
            <PawPrint color={result.color} size={20} />
            <Text style={styles.sectionHeaderText}>Animale Guida</Text>
          </View>
          <Text style={styles.detailValue}>{result.spiritAnimal}</Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.sectionHeader}>
            <MapPin color={result.color} size={20} />
            <Text style={styles.sectionHeaderText}>Il Tuo Stile di Viaggio</Text>
          </View>
          <Text style={styles.detailValue}>{result.travelStyle}</Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.sectionHeader}>
            <Users color={result.color} size={20} />
            <Text style={styles.sectionHeaderText}>Compagno Ideale</Text>
          </View>
          <Text style={styles.detailValue}>{result.idealCompanion}</Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.sectionHeader}>
            <Briefcase color={result.color} size={20} />
            <Text style={styles.sectionHeaderText}>Must-Have in Valigia</Text>
          </View>
          {result.mustHaveItems.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemNumber}>{i + 1}</Text>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.twoColRow}>
          <View style={[styles.miniCard, { flex: 1, marginRight: 8 }]}>
            <UtensilsCrossed color={result.color} size={18} />
            <Text style={styles.miniCardTitle}>Cibo Preferito</Text>
            <Text style={styles.miniCardText}>{result.favoriteFood}</Text>
          </View>
          <View style={[styles.miniCard, { flex: 1, marginLeft: 8 }]}>
            <Music color={result.color} size={18} />
            <Text style={styles.miniCardTitle}>Colonna Sonora</Text>
            <Text style={styles.miniCardText}>{result.soundtrack}</Text>
          </View>
        </View>

        <AdBanner style={{ marginHorizontal: 0, marginBottom: 16, marginTop: 8 }} />

        <Text style={styles.destSectionTitle}>Destinazioni Perfette per Te</Text>

        {matchedDestinations.map((dest) => {
          const isAdded = trips.some(t => t.destination === dest.name);
          return (
            <View key={dest.id} style={styles.destCard}>
              <View style={styles.destImageContainer}>
                <Image
                  source={{ uri: dest.image }}
                  style={styles.destImage}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.destOverlay}
                >
                  <Text style={styles.destName}>{dest.name}</Text>
                  <Text style={styles.destCountry}>{dest.flag} {dest.country}</Text>
                </LinearGradient>
              </View>

              <View style={styles.destInfo}>
                <View style={[styles.infoCard, { borderLeftColor: Colors.teal }]}>
                  <View style={styles.infoHeader}>
                    <Heart color={Colors.teal} size={16} />
                    <Text style={styles.infoLabel}>Perché è perfetta per te</Text>
                  </View>
                  {dest.reasons.map((reason, i) => (
                    <Text key={i} style={styles.infoText}>• {reason}</Text>
                  ))}
                </View>

                <View style={[styles.infoCard, { borderLeftColor: Colors.purple }]}>
                  <View style={styles.infoHeader}>
                    <CalendarDays color={Colors.purple} size={16} />
                    <Text style={styles.infoLabel}>Periodo migliore</Text>
                  </View>
                  <Text style={styles.infoText}>{dest.bestSeason}</Text>
                </View>

                <View style={[styles.infoCard, { borderLeftColor: Colors.coral }]}>
                  <View style={styles.infoHeader}>
                    <Coins color={Colors.coral} size={16} />
                    <Text style={styles.infoLabel}>Budget stimato</Text>
                  </View>
                  <Text style={styles.infoBudget}>{dest.budget} - {dest.budgetLabel}</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                  {dest.gallery.map((img, i) => (
                    <Image
                      key={i}
                      source={{ uri: img }}
                      style={styles.galleryImage}
                      contentFit="cover"
                    />
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.addTripBtn, isAdded && styles.addTripBtnDisabled]}
                  onPress={() => handleAddTrip(dest)}
                  activeOpacity={0.85}
                  disabled={isAdded}
                >
                  <Plus color={Colors.white} size={18} />
                  <Text style={styles.addTripText}>
                    {isAdded ? 'Già aggiunto ai Viaggi' : 'Aggiungi ai Miei Viaggi'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={handleRetakeQuiz}
          activeOpacity={0.85}
        >
          <RefreshCw color={Colors.teal} size={18} />
          <Text style={styles.retakeText}>Rifai il Quiz</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroContainer: {
    height: 360,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },

  profileLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500' as const,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mottoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  mottoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  descCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  descText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  strengthText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  itemNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    overflow: 'hidden',
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  twoColRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  miniCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  miniCardTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 6,
  },
  miniCardText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  destSectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  destCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  destImageContainer: {
    height: 180,
    position: 'relative',
  },
  destImage: {
    width: '100%',
    height: '100%',
  },
  destOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 40,
  },
  destName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  destCountry: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  destInfo: {
    padding: 16,
  },
  infoCard: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 14,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  infoBudget: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  gallery: {
    marginBottom: 14,
  },
  galleryImage: {
    width: (width - 80) / 2.5,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
  },
  addTripBtn: {
    backgroundColor: Colors.coral,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 50,
  },
  addTripBtnDisabled: {
    backgroundColor: Colors.textLight,
  },
  addTripText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.teal,
    marginTop: 10,
    marginBottom: 10,
  },
  retakeText: {
    color: Colors.teal,
    fontSize: 15,
    fontWeight: '700' as const,
  },
});
