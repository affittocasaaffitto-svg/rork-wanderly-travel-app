import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Palmtree, Mountain, Building2, Compass, Hotel, Tent, Home, Bed,
  Plane, TrainFront, Car, Bus, User, Heart, Users, UsersRound,
  Coins, Banknote, Gem, Crown, Armchair, Bike, Landmark, Moon,
  CalendarDays, Sun, Wind, Snowflake, CloudSun, ChevronLeft,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { quizQuestions, profileResults } from '@/constants/quiz';
import { useAppState } from '@/hooks/useAppState';
import { TravelerProfile } from '@/types';
import AdInterstitial from '@/components/AdInterstitial';

const { width } = Dimensions.get('window');

const iconMap: Record<string, React.ComponentType<{ color: string; size: number }>> = {
  Palmtree, Mountain, Building2, Compass, Hotel, Tent, Home, Bed,
  Plane, TrainFront, Car, Bus, User, Heart, Users, UsersRound,
  Coins, Banknote, Gem, Crown, Armchair, Bike, Landmark, Moon,
  CalendarDays, Sun, Wind, Snowflake, CloudSun,
};

export default function QuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateProfile, saveQuizAnswers } = useAppState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<TravelerProfile | null>(null);
  const [pendingAnswers, setPendingAnswers] = useState<string[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const question = quizQuestions[currentQuestion];
  const progress = (currentQuestion + 1) / quizQuestions.length;

  const calculateProfile = useCallback((allAnswers: string[]): TravelerProfile => {
    const scores: Record<TravelerProfile, number> = {
      beach_lover: 0,
      mountain_explorer: 0,
      city_wanderer: 0,
      adventure_seeker: 0,
      luxury_traveler: 0,
      budget_backpacker: 0,
    };

    allAnswers.forEach((answerId) => {
      for (const q of quizQuestions) {
        const option = q.options.find(o => o.id === answerId);
        if (option) {
          option.profiles.forEach(p => {
            scores[p] += 1;
          });
        }
      }
    });

    let maxScore = 0;
    let result: TravelerProfile = 'adventure_seeker';
    (Object.entries(scores) as [TravelerProfile, number][]).forEach(([profile, score]) => {
      if (score > maxScore) {
        maxScore = score;
        result = profile;
      }
    });
    return result;
  }, []);

  const handleAnswer = useCallback((optionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newAnswers = [...answers, optionId];
    setAnswers(newAnswers);

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -width, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        slideAnim.setValue(width);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      } else {
        const profileType = calculateProfile(newAnswers);
        setPendingProfile(profileType);
        setPendingAnswers(newAnswers);
        setShowInterstitial(true);
      }
    });
  }, [answers, currentQuestion, calculateProfile]);

  const IconComponent = useCallback(({ iconName, color, size }: { iconName: string; color: string; size: number }) => {
    const Icon = iconMap[iconName];
    if (!Icon) return null;
    return <Icon color={color} size={size} />;
  }, []);

  const handleInterstitialClose = useCallback(() => {
    setShowInterstitial(false);
    if (pendingProfile && pendingAnswers.length > 0) {
      saveQuizAnswers(pendingAnswers);
      updateProfile(pendingProfile);
      router.replace('/(tabs)/(home)/results' as any);
    }
  }, [pendingProfile, pendingAnswers, saveQuizAnswers, updateProfile, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AdInterstitial visible={showInterstitial} onClose={handleInterstitialClose} />
      <LinearGradient
        colors={['#4DD0E1', '#5C8AE6', '#7B68EE']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft color={Colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Viaggiatore</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <View style={styles.progressSection}>
        <Text style={styles.progressText}>{currentQuestion + 1} di {quizQuestions.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <Animated.View
        style={[
          styles.questionContainer,
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionBtn}
              onPress={() => handleAnswer(option.id)}
              activeOpacity={0.8}
              testID={`quiz-option-${option.id}`}
            >
              <LinearGradient
                colors={['#4DD0E1', '#7B68EE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.optionGradient}
              >
                <IconComponent iconName={option.icon} color={Colors.white} size={22} />
                <Text style={styles.optionText}>{option.text}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  progressSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.coral,
    borderRadius: 3,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 14,
  },
  optionBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 14,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
    flex: 1,
  },
});
