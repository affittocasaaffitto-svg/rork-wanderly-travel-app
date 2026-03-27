import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  BookOpen,
  Plus,
  X,
  MapPin,
  Trash2,
  ChevronLeft,
  Pencil,
  Clock,
  Feather,
  Heart,
  TrendingUp,
  Sparkles,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppState } from '@/hooks/useAppState';
import { DiaryEntry } from '@/types';

const { width } = Dimensions.get('window');
const EMPTY_IMG = 'https://r2-pub.rork.com/generated-images/d61111c8-373e-4272-b8dd-55fcb5ab4b2e.png';

const MOODS: { key: DiaryEntry['mood']; label: string; color: string; emoji: string; bg: string }[] = [
  { key: 'amazing', label: 'Fantastico', color: '#FF6B6B', emoji: '🤩', bg: '#FFF0F0' },
  { key: 'good', label: 'Bene', color: '#4DD0E1', emoji: '😊', bg: '#E0F7FA' },
  { key: 'okay', label: 'Così così', color: '#FFB74D', emoji: '😐', bg: '#FFF8E1' },
  { key: 'bad', label: 'Male', color: '#90A4AE', emoji: '😔', bg: '#ECEFF1' },
];

const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const MONTHS_SHORT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()] ?? '';
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function getRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Oggi';
  if (diffDays === 1) return 'Ieri';
  if (diffDays < 7) return `${diffDays} giorni fa`;
  return formatDate(dateStr);
}

function getMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  return `${MONTHS_IT[date.getMonth()] ?? ''} ${date.getFullYear()}`;
}

function getDayOfMonth(dateStr: string): number {
  return new Date(dateStr).getDate();
}

function getDayName(dateStr: string): string {
  const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  return days[new Date(dateStr).getDay()] ?? '';
}

export default function DiaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { diary, addDiaryEntry, removeDiaryEntry } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newText, setNewText] = useState('');
  const [newMood, setNewMood] = useState<DiaryEntry['mood']>('good');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const moodStats = useMemo(() => {
    if (diary.length === 0) return null;
    const counts: Record<string, number> = { amazing: 0, good: 0, okay: 0, bad: 0 };
    diary.forEach(e => { counts[e.mood] = (counts[e.mood] ?? 0) + 1; });
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const dominantMood = MOODS.find(m => m.key === dominant?.[0]);
    return { counts, dominantMood, total: diary.length };
  }, [diary]);

  const groupedEntries = useMemo(() => {
    const groups: { monthYear: string; entries: DiaryEntry[] }[] = [];
    let currentGroup: string | null = null;
    diary.forEach(entry => {
      const my = getMonthYear(entry.date);
      if (my !== currentGroup) {
        currentGroup = my;
        groups.push({ monthYear: my, entries: [entry] });
      } else {
        groups[groups.length - 1]?.entries.push(entry);
      }
    });
    return groups;
  }, [diary]);

  const handleAddEntry = useCallback(() => {
    if (!newText.trim()) {
      Alert.alert('Attenzione', 'Scrivi qualcosa nel tuo diario!');
      return;
    }
    const entry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      tripName: newTripName.trim() || 'Viaggio senza nome',
      location: newLocation.trim() || '',
      date: new Date().toISOString(),
      mood: newMood,
      text: newText.trim(),
      photos: [],
    };
    addDiaryEntry(entry);
    setNewTripName('');
    setNewLocation('');
    setNewText('');
    setNewMood('good');
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newTripName, newLocation, newText, newMood, addDiaryEntry]);

  const handleDeleteEntry = useCallback((id: string) => {
    Alert.alert('Elimina', 'Vuoi eliminare questa nota dal diario?', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: () => {
          removeDiaryEntry(id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    ]);
  }, [removeDiaryEntry]);

  const getMoodData = (mood: DiaryEntry['mood']) => {
    return MOODS.find(m => m.key === mood) ?? MOODS[1]!;
  };

  const toggleExpand = (id: string) => {
    setExpandedEntry(prev => (prev === id ? null : id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderTimelineEntry = (entry: DiaryEntry, isLast: boolean) => {
    const moodData = getMoodData(entry.mood);
    const isExpanded = expandedEntry === entry.id;
    const needsTruncate = entry.text.length > 120;
    const day = getDayOfMonth(entry.date);
    const dayName = getDayName(entry.date);

    return (
      <View key={entry.id} style={styles.timelineRow}>
        <View style={styles.timelineDateCol}>
          <Text style={styles.timelineDay}>{day}</Text>
          <Text style={styles.timelineDayName}>{dayName}</Text>
        </View>

        <View style={styles.timelineIndicator}>
          <View style={[styles.timelineDot, { backgroundColor: moodData.color }]} />
          {!isLast && <View style={styles.timelineLine} />}
        </View>

        <TouchableOpacity
          style={styles.entryCard}
          activeOpacity={0.92}
          onPress={() => toggleExpand(entry.id)}
          onLongPress={() => handleDeleteEntry(entry.id)}
        >
          <View style={[styles.entryMoodStrip, { backgroundColor: moodData.color }]} />
          <View style={styles.entryBody}>
            <View style={styles.entryTopRow}>
              <View style={[styles.moodPill, { backgroundColor: moodData.bg }]}>
                <Text style={styles.moodEmoji}>{moodData.emoji}</Text>
                <Text style={[styles.moodLabel, { color: moodData.color }]}>{moodData.label}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteEntryBtn}
                onPress={() => handleDeleteEntry(entry.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2 color={Colors.textLight} size={14} />
              </TouchableOpacity>
            </View>

            <Text style={styles.entryTripName}>{entry.tripName}</Text>

            {entry.location ? (
              <View style={styles.entryLocationRow}>
                <MapPin color={Colors.textLight} size={11} />
                <Text style={styles.entryLocation}>{entry.location}</Text>
              </View>
            ) : null}

            <Text style={styles.entryText} numberOfLines={isExpanded ? undefined : 3}>
              {entry.text}
            </Text>

            {needsTruncate && !isExpanded && (
              <Text style={styles.readMore}>Leggi tutto →</Text>
            )}

            <View style={styles.entryFooter}>
              <Clock color={Colors.textLight} size={10} />
              <Text style={styles.entryTime}>{getRelativeDate(entry.date)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#FF8A65', '#E85D4A', '#C62828']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconBg}>
              <Feather color="#fff" size={18} />
            </View>
            <Text style={styles.headerTitle}>Il Mio Diario</Text>
          </View>
          <View style={styles.headerCountBg}>
            <Text style={styles.headerCount}>{diary.length}</Text>
          </View>
        </View>

        {moodStats && moodStats.dominantMood && (
          <View style={styles.moodSummary}>
            <View style={styles.moodSummaryLeft}>
              <Sparkles color="rgba(255,255,255,0.7)" size={14} />
              <Text style={styles.moodSummaryText}>
                Umore prevalente: <Text style={styles.moodSummaryBold}>{moodStats.dominantMood.emoji} {moodStats.dominantMood.label}</Text>
              </Text>
            </View>
            <View style={styles.moodDotsRow}>
              {MOODS.map(m => {
                const count = moodStats.counts[m.key] ?? 0;
                const pct = moodStats.total > 0 ? (count / moodStats.total) * 100 : 0;
                return (
                  <View key={m.key} style={styles.moodBarWrap}>
                    <View style={[styles.moodBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                      <View style={[styles.moodBarFill, { backgroundColor: m.color, width: `${Math.max(pct, 8)}%` }]} />
                    </View>
                    <Text style={styles.moodBarEmoji}>{m.emoji}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {diary.length === 0 ? (
          <Animated.View style={[styles.emptyState, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Image source={{ uri: EMPTY_IMG }} style={styles.emptyImage} resizeMode="contain" />
            <Text style={styles.emptyTitle}>Il tuo diario è vuoto</Text>
            <Text style={styles.emptyDesc}>
              Inizia a scrivere i tuoi ricordi di viaggio!{'\n'}Ogni avventura merita di essere raccontata.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FF8A65', '#E85D4A']}
                style={styles.emptyBtnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Pencil color="#fff" size={16} />
                <Text style={styles.emptyBtnText}>Scrivi la prima nota</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {groupedEntries.map((group, gi) => (
              <View key={group.monthYear}>
                <View style={styles.monthHeader}>
                  <View style={styles.monthLine} />
                  <Text style={styles.monthText}>{group.monthYear}</Text>
                  <View style={styles.monthLine} />
                </View>
                {group.entries.map((entry, ei) => {
                  const isLastInGroup = ei === group.entries.length - 1;
                  const isLastOverall = gi === groupedEntries.length - 1 && isLastInGroup;
                  return renderTimelineEntry(entry, isLastOverall);
                })}
              </View>
            ))}
          </Animated.View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#FF8A65', '#E85D4A']}
          style={styles.fabGrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Plus color="#fff" size={26} />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Feather color="#E85D4A" size={20} />
                <Text style={styles.modalTitle}>Nuova Nota</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Come ti senti?</Text>
            <View style={styles.moodRow}>
              {MOODS.map(m => (
                <TouchableOpacity
                  key={m.key}
                  style={[
                    styles.moodOption,
                    newMood === m.key && { backgroundColor: m.bg, borderColor: m.color },
                  ]}
                  onPress={() => {
                    setNewMood(m.key);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodOptionEmoji}>{m.emoji}</Text>
                  <Text style={[
                    styles.moodOptionLabel,
                    newMood === m.key && { color: m.color, fontWeight: '700' as const },
                  ]}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Nome viaggio</Text>
            <TextInput
              style={styles.input}
              placeholder="Es. Weekend a Roma"
              placeholderTextColor={Colors.textLight}
              value={newTripName}
              onChangeText={setNewTripName}
            />

            <Text style={styles.fieldLabel}>Luogo</Text>
            <TextInput
              style={styles.input}
              placeholder="Es. Colosseo, Roma"
              placeholderTextColor={Colors.textLight}
              value={newLocation}
              onChangeText={setNewLocation}
            />

            <Text style={styles.fieldLabel}>Il tuo racconto</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Scrivi qui i tuoi ricordi, pensieri, emozioni..."
              placeholderTextColor={Colors.textLight}
              value={newText}
              onChangeText={setNewText}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddEntry} activeOpacity={0.85}>
              <LinearGradient
                colors={['#FF8A65', '#E85D4A']}
                style={styles.saveBtnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Pencil color="#fff" size={16} />
                <Text style={styles.saveBtnText}>Salva nel diario</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F6',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#fff',
  },
  headerCountBg: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  headerCount: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#fff',
  },
  moodSummary: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  moodSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodSummaryText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  moodSummaryBold: {
    fontWeight: '700' as const,
    color: '#fff',
  },
  moodDotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  moodBarWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  moodBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  moodBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  moodBarEmoji: {
    fontSize: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 32,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyBtn: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  emptyBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700' as const,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  monthLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0D6D3',
  },
  monthText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#B0908A',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingRight: 8,
  },
  timelineDateCol: {
    width: 38,
    alignItems: 'center',
    paddingTop: 14,
  },
  timelineDay: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  timelineDayName: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.textLight,
    textTransform: 'uppercase' as const,
  },
  timelineIndicator: {
    width: 24,
    alignItems: 'center',
    paddingTop: 18,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFF8F6',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E8DCD9',
    marginTop: 4,
  },
  entryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#D4A59A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  entryMoodStrip: {
    width: 4,
  },
  entryBody: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  moodEmoji: {
    fontSize: 14,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  deleteEntryBtn: {
    padding: 4,
  },
  entryTripName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  entryLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  entryLocation: {
    fontSize: 12,
    color: Colors.textLight,
  },
  entryText: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 21,
    marginTop: 2,
  },
  readMore: {
    fontSize: 12,
    color: '#E85D4A',
    fontWeight: '600' as const,
    marginTop: 2,
  },
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  entryTime: {
    fontSize: 10,
    color: Colors.textLight,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#E85D4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabGrad: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  moodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  moodOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 4,
  },
  moodOptionEmoji: {
    fontSize: 20,
  },
  moodOptionLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 14,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  saveBtn: {
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 4,
  },
  saveBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 50,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
