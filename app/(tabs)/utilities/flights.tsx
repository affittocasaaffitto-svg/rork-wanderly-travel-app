import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  Plane, Plus, X, Clock, MapPin, Calendar, ChevronRight,
  CircleCheck as CheckCircle, AlertCircle, CircleAlert as AlertOctagon, Trash2,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

type FlightStatus = 'on_time' | 'delayed' | 'cancelled' | 'boarding' | 'landed';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  departureCode: string;
  arrival: string;
  arrivalCode: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  status: FlightStatus;
  gate: string;
  terminal: string;
  delay?: number;
}

const STATUS_CONFIG: Record<FlightStatus, { label: string; color: string; bgColor: string }> = {
  on_time: { label: 'In Orario', color: '#4CAF50', bgColor: '#E8F5E9' },
  delayed: { label: 'In Ritardo', color: '#FF9800', bgColor: '#FFF3E0' },
  cancelled: { label: 'Cancellato', color: '#F44336', bgColor: '#FFEBEE' },
  boarding: { label: 'Imbarco', color: '#2196F3', bgColor: '#E3F2FD' },
  landed: { label: 'Atterrato', color: '#7B68EE', bgColor: '#EDE7F6' },
};

const MOCK_FLIGHTS: Flight[] = [
  {
    id: '1', airline: 'Alitalia', flightNumber: 'AZ 1234',
    departure: 'Roma Fiumicino', departureCode: 'FCO',
    arrival: 'Parigi CDG', arrivalCode: 'CDG',
    departureTime: '14:30', arrivalTime: '17:00',
    date: '2026-02-18', status: 'on_time', gate: 'B22', terminal: 'T3',
  },
  {
    id: '2', airline: 'Ryanair', flightNumber: 'FR 5678',
    departure: 'Milano Malpensa', departureCode: 'MXP',
    arrival: 'Barcellona', arrivalCode: 'BCN',
    departureTime: '08:15', arrivalTime: '10:30',
    date: '2026-02-20', status: 'delayed', gate: 'A12', terminal: 'T1', delay: 45,
  },
  {
    id: '3', airline: 'Lufthansa', flightNumber: 'LH 9012',
    departure: 'Francoforte', departureCode: 'FRA',
    arrival: 'Roma Fiumicino', arrivalCode: 'FCO',
    departureTime: '11:00', arrivalTime: '13:15',
    date: '2026-02-15', status: 'landed', gate: 'C8', terminal: 'T1',
  },
];

export default function FlightsScreen() {
  const [flights, setFlights] = useState<Flight[]>(MOCK_FLIGHTS);
  const [showModal, setShowModal] = useState(false);
  const [newAirline, setNewAirline] = useState('');
  const [newFlightNumber, setNewFlightNumber] = useState('');
  const [newDeparture, setNewDeparture] = useState('');
  const [newDepartureCode, setNewDepartureCode] = useState('');
  const [newArrival, setNewArrival] = useState('');
  const [newArrivalCode, setNewArrivalCode] = useState('');
  const [newDepTime, setNewDepTime] = useState('');
  const [newArrTime, setNewArrTime] = useState('');
  const [newDate, setNewDate] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const upcomingFlights = useMemo(() =>
    flights.filter(f => f.status !== 'landed' && f.status !== 'cancelled')
      .sort((a, b) => a.date.localeCompare(b.date)),
    [flights]
  );

  const pastFlights = useMemo(() =>
    flights.filter(f => f.status === 'landed' || f.status === 'cancelled')
      .sort((a, b) => b.date.localeCompare(a.date)),
    [flights]
  );

  const handleAdd = useCallback(() => {
    if (!newFlightNumber.trim()) return;
    const flight: Flight = {
      id: Date.now().toString(),
      airline: newAirline.trim() || 'Compagnia',
      flightNumber: newFlightNumber.trim().toUpperCase(),
      departure: newDeparture.trim() || 'Partenza',
      departureCode: newDepartureCode.trim().toUpperCase() || '---',
      arrival: newArrival.trim() || 'Arrivo',
      arrivalCode: newArrivalCode.trim().toUpperCase() || '---',
      departureTime: newDepTime.trim() || '00:00',
      arrivalTime: newArrTime.trim() || '00:00',
      date: newDate.trim() || new Date().toISOString().split('T')[0],
      status: 'on_time',
      gate: 'TBD',
      terminal: 'TBD',
    };
    setFlights(prev => [flight, ...prev]);
    setNewAirline('');
    setNewFlightNumber('');
    setNewDeparture('');
    setNewDepartureCode('');
    setNewArrival('');
    setNewArrivalCode('');
    setNewDepTime('');
    setNewArrTime('');
    setNewDate('');
    setShowModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newAirline, newFlightNumber, newDeparture, newDepartureCode, newArrival, newArrivalCode, newDepTime, newArrTime, newDate]);

  const handleDelete = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFlights(prev => prev.filter(f => f.id !== id));
  }, []);

  const toggleExpand = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const getStatusIcon = (status: FlightStatus) => {
    switch (status) {
      case 'on_time': return <CheckCircle color={STATUS_CONFIG.on_time.color} size={16} />;
      case 'delayed': return <AlertCircle color={STATUS_CONFIG.delayed.color} size={16} />;
      case 'cancelled': return <AlertOctagon color={STATUS_CONFIG.cancelled.color} size={16} />;
      case 'boarding': return <Plane color={STATUS_CONFIG.boarding.color} size={16} />;
      case 'landed': return <CheckCircle color={STATUS_CONFIG.landed.color} size={16} />;
    }
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
  };

  const renderFlightCard = (flight: Flight) => {
    const statusInfo = STATUS_CONFIG[flight.status];
    const isExpanded = expandedId === flight.id;

    return (
      <TouchableOpacity
        key={flight.id}
        style={styles.flightCard}
        onPress={() => toggleExpand(flight.id)}
        activeOpacity={0.8}
      >
        <View style={styles.flightHeader}>
          <View style={styles.airlineRow}>
            <View style={styles.airlineLogo}>
              <Plane color={Colors.white} size={14} />
            </View>
            <View>
              <Text style={styles.airlineName}>{flight.airline}</Text>
              <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
            {getStatusIcon(flight.status)}
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
              {flight.delay ? ` +${flight.delay}min` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.routeSection}>
          <View style={styles.routePoint}>
            <Text style={styles.routeCode}>{flight.departureCode}</Text>
            <Text style={styles.routeTime}>{flight.departureTime}</Text>
            <Text style={styles.routeCity} numberOfLines={1}>{flight.departure}</Text>
          </View>

          <View style={styles.routeLine}>
            <View style={styles.routeDot} />
            <View style={styles.routeDash} />
            <View style={styles.routePlaneIcon}>
              <Plane color={Colors.teal} size={16} />
            </View>
            <View style={styles.routeDash} />
            <View style={styles.routeDot} />
          </View>

          <View style={[styles.routePoint, styles.routePointRight]}>
            <Text style={styles.routeCode}>{flight.arrivalCode}</Text>
            <Text style={styles.routeTime}>{flight.arrivalTime}</Text>
            <Text style={styles.routeCity} numberOfLines={1}>{flight.arrival}</Text>
          </View>
        </View>

        <View style={styles.flightDateRow}>
          <Calendar color={Colors.textLight} size={14} />
          <Text style={styles.flightDate}>{formatDate(flight.date)}</Text>
        </View>

        {isExpanded && (
          <View style={styles.expandedSection}>
            <View style={styles.expandedDivider} />
            <View style={styles.expandedGrid}>
              <View style={styles.expandedItem}>
                <Text style={styles.expandedLabel}>Terminal</Text>
                <Text style={styles.expandedValue}>{flight.terminal}</Text>
              </View>
              <View style={styles.expandedItem}>
                <Text style={styles.expandedLabel}>Gate</Text>
                <Text style={styles.expandedValue}>{flight.gate}</Text>
              </View>
              <View style={styles.expandedItem}>
                <Text style={styles.expandedLabel}>Stato</Text>
                <Text style={[styles.expandedValue, { color: statusInfo.color }]}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteFlightBtn}
              onPress={() => handleDelete(flight.id)}
            >
              <Trash2 color={Colors.coralDark} size={16} />
              <Text style={styles.deleteFlightText}>Elimina Volo</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#4DD0E1', '#26C6DA', '#00ACC1']}
          style={styles.heroCard}
        >
          <Plane color="rgba(255,255,255,0.3)" size={80} style={styles.heroBgIcon} />
          <Text style={styles.heroTitle}>I Tuoi Voli</Text>
          <Text style={styles.heroSubtitle}>
            {upcomingFlights.length} voli in programma
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatNumber}>{upcomingFlights.length}</Text>
              <Text style={styles.heroStatLabel}>Prossimi</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatNumber}>{pastFlights.length}</Text>
              <Text style={styles.heroStatLabel}>Completati</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatNumber}>{flights.length}</Text>
              <Text style={styles.heroStatLabel}>Totali</Text>
            </View>
          </View>
        </LinearGradient>

        {upcomingFlights.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Prossimi Voli</Text>
            {upcomingFlights.map(renderFlightCard)}
          </>
        )}

        {pastFlights.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Voli Passati</Text>
            {pastFlights.map(renderFlightCard)}
          </>
        )}

        {flights.length === 0 && (
          <View style={styles.emptyState}>
            <Plane color={Colors.textLight} size={48} />
            <Text style={styles.emptyText}>Nessun volo salvato</Text>
            <Text style={styles.emptySubtext}>Aggiungi il tuo prossimo volo</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowModal(true);
        }}
        activeOpacity={0.85}
      >
        <Plus color={Colors.white} size={24} />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <View style={styles.modalIconWrap}>
                    <Plane color={Colors.white} size={18} />
                  </View>
                  <Text style={styles.modalTitle}>Nuovo Volo</Text>
                </View>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowModal(false)}>
                  <X color={Colors.textSecondary} size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.formSection}>
                <View style={styles.formSectionHeader}>
                  <Plane color={Colors.tealDark} size={15} />
                  <Text style={styles.formSectionTitle}>Info Volo</Text>
                </View>
                <View style={styles.formCard}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Compagnia Aerea</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Es. Alitalia, Ryanair..."
                      placeholderTextColor={Colors.textLight}
                      value={newAirline}
                      onChangeText={setNewAirline}
                    />
                  </View>
                  <View style={styles.formDivider} />
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Numero Volo</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Es. AZ 1234"
                      placeholderTextColor={Colors.textLight}
                      value={newFlightNumber}
                      onChangeText={setNewFlightNumber}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formSection}>
                <View style={styles.formSectionHeader}>
                  <MapPin color="#4CAF50" size={15} />
                  <Text style={styles.formSectionTitle}>Partenza</Text>
                </View>
                <View style={styles.formCard}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Città / Aeroporto</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Es. Roma Fiumicino"
                      placeholderTextColor={Colors.textLight}
                      value={newDeparture}
                      onChangeText={setNewDeparture}
                    />
                  </View>
                  <View style={styles.formDivider} />
                  <View style={styles.formRowInCard}>
                    <View style={styles.formFieldSmall}>
                      <Text style={styles.formLabel}>Codice IATA</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="FCO"
                        placeholderTextColor={Colors.textLight}
                        value={newDepartureCode}
                        onChangeText={setNewDepartureCode}
                        maxLength={3}
                        autoCapitalize="characters"
                      />
                    </View>
                    <View style={styles.formFieldVertDivider} />
                    <View style={styles.formFieldSmall}>
                      <Text style={styles.formLabel}>Ora Partenza</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="14:30"
                        placeholderTextColor={Colors.textLight}
                        value={newDepTime}
                        onChangeText={setNewDepTime}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.formSection}>
                <View style={styles.formSectionHeader}>
                  <MapPin color="#FF5252" size={15} />
                  <Text style={styles.formSectionTitle}>Arrivo</Text>
                </View>
                <View style={styles.formCard}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Città / Aeroporto</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Es. Parigi CDG"
                      placeholderTextColor={Colors.textLight}
                      value={newArrival}
                      onChangeText={setNewArrival}
                    />
                  </View>
                  <View style={styles.formDivider} />
                  <View style={styles.formRowInCard}>
                    <View style={styles.formFieldSmall}>
                      <Text style={styles.formLabel}>Codice IATA</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="CDG"
                        placeholderTextColor={Colors.textLight}
                        value={newArrivalCode}
                        onChangeText={setNewArrivalCode}
                        maxLength={3}
                        autoCapitalize="characters"
                      />
                    </View>
                    <View style={styles.formFieldVertDivider} />
                    <View style={styles.formFieldSmall}>
                      <Text style={styles.formLabel}>Ora Arrivo</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="17:00"
                        placeholderTextColor={Colors.textLight}
                        value={newArrTime}
                        onChangeText={setNewArrTime}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.formSection}>
                <View style={styles.formSectionHeader}>
                  <Calendar color={Colors.purple} size={15} />
                  <Text style={styles.formSectionTitle}>Data</Text>
                </View>
                <View style={styles.formCard}>
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Data del Volo</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Es. 2026-03-15"
                      placeholderTextColor={Colors.textLight}
                      value={newDate}
                      onChangeText={setNewDate}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
                <Plane color={Colors.white} size={18} />
                <Text style={styles.addBtnText}>Aggiungi Volo</Text>
              </TouchableOpacity>
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroCard: {
    margin: 16,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  heroBgIcon: {
    position: 'absolute',
    right: -10,
    top: -10,
    transform: [{ rotate: '30deg' }],
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  heroStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  flightCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  airlineLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  airlineName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  flightNumber: {
    fontSize: 12,
    color: Colors.textLight,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  routeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routePoint: {
    flex: 1,
  },
  routePointRight: {
    alignItems: 'flex-end',
  },
  routeCode: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  routeTime: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  routeCity: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.teal,
  },
  routeDash: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
  },
  routePlaneIcon: {
    marginHorizontal: 4,
    transform: [{ rotate: '90deg' }],
  },
  flightDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flightDate: {
    fontSize: 13,
    color: Colors.textLight,
  },
  expandedSection: {
    marginTop: 4,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: Colors.background,
    marginVertical: 12,
  },
  expandedGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  expandedItem: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  expandedLabel: {
    fontSize: 11,
    color: Colors.textLight,
    marginBottom: 4,
  },
  expandedValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  deleteFlightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
  },
  deleteFlightText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.coralDark,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  formSection: {
    marginBottom: 16,
  },
  formSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    marginLeft: 4,
  },
  formSectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  formField: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textLight,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  formInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 4,
    fontWeight: '500' as const,
  },
  formDivider: {
    height: 1,
    backgroundColor: Colors.background,
    marginLeft: 16,
  },
  formRowInCard: {
    flexDirection: 'row',
  },
  formFieldSmall: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formFieldVertDivider: {
    width: 1,
    backgroundColor: Colors.background,
    marginVertical: 10,
  },
  addBtn: {
    backgroundColor: Colors.teal,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
