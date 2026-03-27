import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  Wifi, Plus, X, Eye, EyeOff, Copy, Trash2, Hotel,
  Coffee, Plane, MapPin, Lock,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Clipboard from 'expo-clipboard';

interface WifiEntry {
  id: string;
  name: string;
  location: string;
  password: string;
  type: string;
  date: string;
}

const LOCATION_TYPES = [
  { id: 'hotel', label: 'Hotel', icon: Hotel, color: '#7B68EE' },
  { id: 'cafe', label: 'Caffè', icon: Coffee, color: '#FFB74D' },
  { id: 'airport', label: 'Aeroporto', icon: Plane, color: '#4DD0E1' },
  { id: 'altro', label: 'Altro', icon: MapPin, color: '#FF8A80' },
];

const INITIAL_ENTRIES: WifiEntry[] = [
  { id: '1', name: 'Hotel Roma Central', location: 'Roma, Italia', password: 'Roma2026!guest', type: 'hotel', date: '2026-02-14' },
  { id: '2', name: 'Café de Flore', location: 'Parigi, Francia', password: 'cafeflore_wifi', type: 'cafe', date: '2026-01-20' },
  { id: '3', name: 'FCO Fiumicino T3', location: 'Roma, Italia', password: 'fco_free_2026', type: 'airport', date: '2026-02-12' },
];

export default function WifiScreen() {
  const [entries, setEntries] = useState<WifiEntry[]>(INITIAL_ENTRIES);
  const [showModal, setShowModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newType, setNewType] = useState('hotel');
  const [searchText, setSearchText] = useState('');

  const filteredEntries = entries.filter(e =>
    e.name.toLowerCase().includes(searchText.toLowerCase()) ||
    e.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const togglePasswordVisibility = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVisiblePasswords(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const copyPassword = useCallback(async (password: string) => {
    await Clipboard.setStringAsync(password);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copiato!', 'Password copiata negli appunti');
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      'Elimina',
      'Vuoi eliminare questa rete WiFi salvata?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setEntries(prev => prev.filter(e => e.id !== id));
          },
        },
      ]
    );
  }, []);

  const handleAdd = useCallback(() => {
    if (!newName.trim() || !newPassword.trim()) return;
    const entry: WifiEntry = {
      id: Date.now().toString(),
      name: newName.trim(),
      location: newLocation.trim() || 'Posizione sconosciuta',
      password: newPassword.trim(),
      type: newType,
      date: new Date().toISOString().split('T')[0],
    };
    setEntries(prev => [entry, ...prev]);
    setNewName('');
    setNewLocation('');
    setNewPassword('');
    setShowModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newName, newLocation, newPassword, newType]);

  const getTypeInfo = useCallback((typeId: string) => {
    return LOCATION_TYPES.find(t => t.id === typeId) || LOCATION_TYPES[3];
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1A1A2E', '#2D2D5E']}
          style={styles.heroCard}
        >
          <View style={styles.heroIconRow}>
            <View style={styles.heroIconBg}>
              <Wifi color="#4DD0E1" size={28} />
            </View>
          </View>
          <Text style={styles.heroTitle}>Le Tue Reti WiFi</Text>
          <Text style={styles.heroSubtitle}>{entries.length} password salvate</Text>
          <View style={styles.heroSearchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cerca rete o luogo..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </LinearGradient>

        <View style={styles.typeFilter}>
          {LOCATION_TYPES.map((type) => {
            const Icon = type.icon;
            const count = entries.filter(e => e.type === type.id).length;
            return (
              <View key={type.id} style={styles.typeCard}>
                <View style={[styles.typeIconBg, { backgroundColor: type.color + '20' }]}>
                  <Icon color={type.color} size={18} />
                </View>
                <Text style={styles.typeLabel}>{type.label}</Text>
                <Text style={[styles.typeCount, { color: type.color }]}>{count}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Reti Salvate</Text>

        {filteredEntries.map((entry) => {
          const typeInfo = getTypeInfo(entry.type);
          const Icon = typeInfo.icon;
          const isVisible = visiblePasswords.has(entry.id);

          return (
            <View key={entry.id} style={styles.wifiCard}>
              <View style={styles.wifiCardTop}>
                <View style={[styles.wifiIcon, { backgroundColor: typeInfo.color + '20' }]}>
                  <Icon color={typeInfo.color} size={18} />
                </View>
                <View style={styles.wifiInfo}>
                  <Text style={styles.wifiName}>{entry.name}</Text>
                  <Text style={styles.wifiLocation}>{entry.location} · {entry.date}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDelete(entry.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Trash2 color={Colors.textLight} size={16} />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordRow}>
                <Lock color={Colors.textLight} size={14} />
                <Text style={styles.passwordText}>
                  {isVisible ? entry.password : '••••••••••••'}
                </Text>
                <TouchableOpacity
                  style={styles.passwordAction}
                  onPress={() => togglePasswordVisibility(entry.id)}
                >
                  {isVisible ? (
                    <EyeOff color={Colors.textSecondary} size={18} />
                  ) : (
                    <Eye color={Colors.textSecondary} size={18} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.passwordAction}
                  onPress={() => copyPassword(entry.password)}
                >
                  <Copy color={Colors.teal} size={18} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {filteredEntries.length === 0 && (
          <View style={styles.emptyState}>
            <Wifi color={Colors.textLight} size={40} />
            <Text style={styles.emptyText}>Nessuna rete trovata</Text>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Aggiungi Rete WiFi</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nome rete (es. Hotel Roma)"
              placeholderTextColor={Colors.textLight}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Posizione (es. Roma, Italia)"
              placeholderTextColor={Colors.textLight}
              value={newLocation}
              onChangeText={setNewLocation}
            />
            <TextInput
              style={styles.input}
              placeholder="Password WiFi"
              placeholderTextColor={Colors.textLight}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={false}
            />
            <Text style={styles.typeSelectLabel}>Tipo di luogo</Text>
            <View style={styles.typeSelectRow}>
              {LOCATION_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeSelectBtn,
                      newType === type.id && { backgroundColor: type.color + '20', borderColor: type.color },
                    ]}
                    onPress={() => setNewType(type.id)}
                  >
                    <Icon color={newType === type.id ? type.color : Colors.textLight} size={18} />
                    <Text style={[
                      styles.typeSelectText,
                      newType === type.id && { color: type.color },
                    ]}>{type.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>Salva Password</Text>
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
    backgroundColor: Colors.background,
  },
  heroCard: {
    margin: 16,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  heroIconRow: {
    marginBottom: 12,
  },
  heroIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(77,208,225,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  heroSearchRow: {
    width: '100%',
    marginTop: 16,
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.white,
  },
  typeFilter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  typeCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  typeIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  typeCount: {
    fontSize: 16,
    fontWeight: '800' as const,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  wifiCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
  },
  wifiCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wifiIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wifiInfo: {
    flex: 1,
  },
  wifiName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  wifiLocation: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 10,
  },
  passwordText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    fontFamily: undefined,
    letterSpacing: 0.5,
  },
  passwordAction: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  typeSelectLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  typeSelectRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  typeSelectBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  typeSelectText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  addBtn: {
    backgroundColor: Colors.teal,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
