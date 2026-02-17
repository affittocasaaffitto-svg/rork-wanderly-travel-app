import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import { Image as ExpoImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Plus,
  X,
  MapPin,
  Calendar,
  Trash2,
  Plane,
  Clock,
  DollarSign,
  ChevronRight,
  Luggage,
  CircleCheck as CheckCircle2,
  Play,
  Flag,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppState } from '@/hooks/useAppState';
import { Trip, TripStatus } from '@/types';

const { width } = Dimensions.get('window');
const EMPTY_IMG = 'https://r2-pub.rork.com/generated-images/b2b36360-4e28-4cda-95e9-eb102188599d.png';

const TRIP_IMAGES = [
  'https://r2-pub.rork.com/generated-images/0189f37e-ca75-456b-99c0-abddb0ef9522.png',
  'https://r2-pub.rork.com/generated-images/dad34505-dde5-4889-8556-fdc1bcaa7ab9.png',
  'https://r2-pub.rork.com/generated-images/85be7bad-2dfa-421d-9d4f-db11060ea16c.png',
  'https://r2-pub.rork.com/generated-images/4f3ff96b-7c07-4406-99ad-a66128fc4abd.png',
  'https://r2-pub.rork.com/generated-images/b65e49be-e604-4dcb-b428-a9dcacff6698.png',
  'https://r2-pub.rork.com/generated-images/3bed0c75-cff8-4299-887d-6f7a2d691ae5.png',
  'https://r2-pub.rork.com/generated-images/be36bc42-4d88-455c-acff-31ef406f1950.png',
  'https://r2-pub.rork.com/generated-images/bd988dea-b7be-483b-855d-ffb301456cd5.png',
];

const STATUS_CONFIG: Record<TripStatus, { label: string; color: string; bgColor: string; icon: typeof Flag }> = {
  planned: { label: 'Pianificato', color: '#5C8AE6', bgColor: '#EBF0FD', icon: Flag },
  ongoing: { label: 'In Corso', color: '#00ACC1', bgColor: '#E0F7FA', icon: Play },
  completed: { label: 'Completato', color: '#43A047', bgColor: '#E8F5E9', icon: CheckCircle2 },
};

const STATUS_TABS: { key: 'all' | TripStatus; label: string }[] = [
  { key: 'all', label: 'Tutti' },
  { key: 'planned', label: 'Pianificati' },
  { key: 'ongoing', label: 'In Corso' },
  { key: 'completed', label: 'Completati' },
];

function formatDateInput(text: string): string {
  const cleaned = text.replace(/[^0-9]/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
}

function getDaysUntil(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length !== 3) return '';
  const date = new Date(parseInt(parts[2] ?? '0', 10), parseInt(parts[1] ?? '0', 10) - 1, parseInt(parts[0] ?? '0', 10));
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)}g fa`;
  if (diff === 0) return 'Oggi';
  if (diff === 1) return 'Domani';
  return `tra ${diff}g`;
}

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const { trips, addTrip, removeTrip, updateTrip } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | TripStatus>('all');
  const [newName, setNewName] = useState('');
  const [newDest, setNewDest] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newStatus, setNewStatus] = useState<TripStatus>('planned');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const filteredTrips = activeTab === 'all'
    ? trips
    : trips.filter(t => (t.status ?? 'planned') === activeTab);

  const stats = {
    total: trips.length,
    planned: trips.filter(t => (t.status ?? 'planned') === 'planned').length,
    ongoing: trips.filter(t => t.status === 'ongoing').length,
    completed: trips.filter(t => t.status === 'completed').length,
  };

  const handleAddTrip = useCallback(() => {
    if (!newName.trim() || !newDest.trim()) {
      Alert.alert('Attenzione', 'Inserisci nome e destinazione del viaggio!');
      return;
    }
    const randomImage = TRIP_IMAGES[Math.floor(Math.random() * TRIP_IMAGES.length)] ?? TRIP_IMAGES[0];
    addTrip({
      id: `trip_${Date.now()}`,
      name: newName.trim(),
      destination: newDest.trim(),
      startDate: newStartDate.trim(),
      endDate: newEndDate.trim(),
      image: randomImage!,
      notes: newNotes.trim(),
      status: newStatus,
      activities: [],
      budget: newBudget.trim(),
    });
    setNewName('');
    setNewDest('');
    setNewNotes('');
    setNewStartDate('');
    setNewEndDate('');
    setNewBudget('');
    setNewStatus('planned');
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newName, newDest, newNotes, newStartDate, newEndDate, newBudget, newStatus, addTrip]);

  const handleDeleteTrip = useCallback((id: string, name: string) => {
    Alert.alert('Elimina Viaggio', `Vuoi eliminare "${name}"?`, [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: () => {
          removeTrip(id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    ]);
  }, [removeTrip]);

  const cycleStatus = useCallback((trip: Trip) => {
    const order: TripStatus[] = ['planned', 'ongoing', 'completed'];
    const current = trip.status ?? 'planned';
    const idx = order.indexOf(current);
    const next = order[(idx + 1) % order.length]!;
    updateTrip(trip.id, { status: next });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [updateTrip]);

  const renderTripCard = (trip: Trip, index: number) => {
    const status = trip.status ?? 'planned';
    const config = STATUS_CONFIG[status];
    const StatusIcon = config.icon;
    const daysInfo = getDaysUntil(trip.startDate);

    return (
      <Animated.View
        key={trip.id}
        style={[
          styles.tripCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ExpoImage
          source={{ uri: trip.image }}
          style={styles.tripImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.tripOverlay}
        >
          <View style={styles.tripTopRow}>
            <TouchableOpacity
              style={[styles.statusBadge, { backgroundColor: config.bgColor }]}
              onPress={() => cycleStatus(trip)}
              activeOpacity={0.7}
            >
              <StatusIcon color={config.color} size={12} />
              <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteTrip(trip.id, trip.name)}
            >
              <Trash2 color="rgba(255,255,255,0.85)" size={16} />
            </TouchableOpacity>
          </View>

          <View style={styles.tripBottom}>
            <Text style={styles.tripName}>{trip.name}</Text>
            <View style={styles.tripInfoRow}>
              <MapPin color="rgba(255,255,255,0.8)" size={13} />
              <Text style={styles.tripDest}>{trip.destination}</Text>
            </View>
            <View style={styles.tripChipsRow}>
              {trip.startDate ? (
                <View style={styles.tripChip}>
                  <Calendar color="rgba(255,255,255,0.7)" size={11} />
                  <Text style={styles.tripChipText}>{trip.startDate}</Text>
                </View>
              ) : null}
              {daysInfo ? (
                <View style={[styles.tripChip, styles.tripChipHighlight]}>
                  <Clock color="#FFD54F" size={11} />
                  <Text style={[styles.tripChipText, { color: '#FFD54F' }]}>{daysInfo}</Text>
                </View>
              ) : null}
              {trip.budget ? (
                <View style={styles.tripChip}>
                  <DollarSign color="rgba(255,255,255,0.7)" size={11} />
                  <Text style={styles.tripChipText}>€{trip.budget}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#4DD0E1', '#0097A7']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconBg}>
              <Plane color="#fff" size={18} />
            </View>
            <Text style={styles.headerTitle}>I Miei Viaggi</Text>
          </View>
          {stats.total > 0 && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{stats.total}</Text>
                <Text style={styles.statLabel}>Totali</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{stats.ongoing}</Text>
                <Text style={styles.statLabel}>Attivi</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Finiti</Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>

      {trips.length > 0 && (
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {STATUS_TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => {
                    setActiveTab(tab.key);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTrips.length === 0 ? (
          <Animated.View style={[styles.emptyState, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Image source={{ uri: EMPTY_IMG }} style={styles.emptyImage} resizeMode="contain" />
            <Text style={styles.emptyTitle}>
              {trips.length === 0 ? 'Nessun viaggio ancora' : 'Nessun viaggio in questa categoria'}
            </Text>
            <Text style={styles.emptyDesc}>
              {trips.length === 0
                ? 'Pianifica la tua prossima avventura!\nOgni grande viaggio inizia con un primo passo.'
                : 'Prova a cambiare filtro o aggiungi un nuovo viaggio.'}
            </Text>
            {trips.length === 0 && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setShowAddModal(true)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#4DD0E1', '#0097A7']}
                  style={styles.emptyBtnGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Luggage color="#fff" size={16} />
                  <Text style={styles.emptyBtnText}>Pianifica il primo viaggio</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>
        ) : (
          filteredTrips.map((trip, index) => renderTripCard(trip, index))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#4DD0E1', '#0097A7']}
          style={styles.fabGrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Plus color="#fff" size={26} />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={[styles.modalScrollContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nuovo Viaggio</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <X color={Colors.textSecondary} size={24} />
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Stato</Text>
              <View style={styles.statusRow}>
                {(['planned', 'ongoing', 'completed'] as TripStatus[]).map(s => {
                  const cfg = STATUS_CONFIG[s];
                  const isActive = newStatus === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      style={[styles.statusOption, isActive && { backgroundColor: cfg.bgColor, borderColor: cfg.color }]}
                      onPress={() => setNewStatus(s)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.statusOptionText, isActive && { color: cfg.color, fontWeight: '700' as const }]}>
                        {cfg.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.fieldLabel}>Nome del viaggio</Text>
              <TextInput
                style={styles.input}
                placeholder="Es. Vacanze in Grecia"
                placeholderTextColor={Colors.textLight}
                value={newName}
                onChangeText={setNewName}
              />

              <Text style={styles.fieldLabel}>Destinazione</Text>
              <TextInput
                style={styles.input}
                placeholder="Es. Santorini, Grecia"
                placeholderTextColor={Colors.textLight}
                value={newDest}
                onChangeText={setNewDest}
              />

              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <Text style={styles.fieldLabel}>Data partenza</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="GG/MM/AAAA"
                    placeholderTextColor={Colors.textLight}
                    value={newStartDate}
                    onChangeText={(t) => setNewStartDate(formatDateInput(t))}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>
                <View style={styles.dateField}>
                  <Text style={styles.fieldLabel}>Data ritorno</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="GG/MM/AAAA"
                    placeholderTextColor={Colors.textLight}
                    value={newEndDate}
                    onChangeText={(t) => setNewEndDate(formatDateInput(t))}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Budget (€)</Text>
              <TextInput
                style={styles.input}
                placeholder="Es. 1500"
                placeholderTextColor={Colors.textLight}
                value={newBudget}
                onChangeText={setNewBudget}
                keyboardType="number-pad"
              />

              <Text style={styles.fieldLabel}>Note</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Appunti, idee, cose da fare..."
                placeholderTextColor={Colors.textLight}
                value={newNotes}
                onChangeText={setNewNotes}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleAddTrip} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#4DD0E1', '#0097A7']}
                  style={styles.saveBtnGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Plane color="#fff" size={16} />
                  <Text style={styles.saveBtnText}>Crea Viaggio</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    gap: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500' as const,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabsContainer: {
    paddingTop: 14,
    paddingBottom: 4,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabActive: {
    backgroundColor: '#0097A7',
    borderColor: '#0097A7',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
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
    textAlign: 'center',
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
  tripCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#006064',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  tripImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  tripOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 14,
  },
  tripTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripBottom: {
    gap: 4,
  },
  tripName: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tripInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDest: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500' as const,
  },
  tripChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  tripChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tripChipHighlight: {
    backgroundColor: 'rgba(255,213,79,0.2)',
  },
  tripChipText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600' as const,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#006064',
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
  modalScroll: {
    maxHeight: '92%',
    marginTop: 'auto',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
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
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  statusOptionText: {
    fontSize: 12,
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
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  textArea: {
    height: 80,
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
