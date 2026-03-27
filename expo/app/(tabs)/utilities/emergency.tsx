import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  Phone, Building2, Shield, Cross, MapPin, Share2, Plus, X, User,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { emergencyNumbers } from '@/constants/emergency';
import { EmergencyContact } from '@/types';

const iconMap: Record<string, React.ComponentType<{ color: string; size: number }>> = {
  Phone, Building2, Shield, Cross,
};

export default function EmergencyScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: 'ec1', name: 'Mario Rossi', relation: 'Padre', phone: '+39 333 1234567' },
    { id: 'ec2', name: 'Marco Wilcon', relation: 'Amico', phone: '+39 340 7654321' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleCall = useCallback((number: string, label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('Chiama', `Stai per chiamare ${label}\n${number}`, [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Chiama', style: 'default' },
    ]);
  }, []);

  const handleShareLocation = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Posizione Condivisa', 'La tua posizione è stata condivisa con i contatti di emergenza.');
  }, []);

  const handleAddContact = useCallback(() => {
    if (!newName.trim() || !newPhone.trim()) return;
    setContacts(prev => [...prev, {
      id: `ec_${Date.now()}`,
      name: newName.trim(),
      relation: newRelation.trim() || 'Contatto',
      phone: newPhone.trim(),
    }]);
    setNewName('');
    setNewRelation('');
    setNewPhone('');
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newName, newRelation, newPhone]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.locationCard}>
          <MapPin color={Colors.teal} size={20} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationCity}>Barcellona, Spagna</Text>
            <Text style={styles.locationCoords}>41° 22' 57" N, 2° 10' 48" E</Text>
          </View>
        </View>

        <View style={styles.emergencyGrid}>
          {emergencyNumbers.map((item) => {
            const Icon = iconMap[item.icon] || Phone;
            return (
              <View key={item.id} style={[styles.emergencyCard, { backgroundColor: item.color + '15' }]}>
                <View style={[styles.emergencyIconBg, { backgroundColor: item.color }]}>
                  <Icon color={Colors.white} size={22} />
                </View>
                <Text style={styles.emergencyLabel}>{item.label}</Text>
                <Text style={[styles.emergencyNumber, { color: item.color }]}>{item.number}</Text>
                <TouchableOpacity
                  style={[styles.callBtn, { backgroundColor: item.color }]}
                  onPress={() => handleCall(item.number, item.label)}
                >
                  <Phone color={Colors.white} size={14} />
                  <Text style={styles.callBtnText}>Chiama</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShareLocation}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#4DD0E1', '#26C6DA']}
            style={styles.shareGradient}
          >
            <Share2 color={Colors.white} size={20} />
            <Text style={styles.shareBtnText}>Condividi Posizione</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.contactsSection}>
          <View style={styles.contactsHeader}>
            <Text style={styles.sectionTitle}>Contatti di Emergenza Personali</Text>
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <Plus color={Colors.teal} size={22} />
            </TouchableOpacity>
          </View>

          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactAvatar}>
                <User color={Colors.white} size={18} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{contact.relation}</Text>
              </View>
              <TouchableOpacity
                style={styles.contactCallBtn}
                onPress={() => handleCall(contact.phone, contact.name)}
              >
                <Phone color={Colors.teal} size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Aggiungi Contatto</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor={Colors.textLight}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Relazione (es. Padre, Amico)"
              placeholderTextColor={Colors.textLight}
              value={newRelation}
              onChangeText={setNewRelation}
            />
            <TextInput
              style={styles.input}
              placeholder="Numero di telefono"
              placeholderTextColor={Colors.textLight}
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddContact}>
              <Text style={styles.addBtnText}>Aggiungi</Text>
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  locationInfo: {
    flex: 1,
  },
  locationCity: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  locationCoords: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  emergencyCard: {
    width: '47%',
    flexGrow: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  emergencyIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emergencyLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  emergencyNumber: {
    fontSize: 20,
    fontWeight: '800' as const,
    marginBottom: 10,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  shareBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 50,
    overflow: 'hidden',
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  contactsSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    gap: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  contactRelation: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  contactCallBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
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
  addBtn: {
    backgroundColor: Colors.coral,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
