import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Check, Plus, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppState } from '@/hooks/useAppState';

const categories = ['Tutti', 'Essenziali', 'Vestiti', 'Elettronica', 'Toilette'];

export default function ChecklistScreen() {
  const { checklist, toggleChecklistItem, addChecklistItem } = useAppState();
  const [activeCategory, setActiveCategory] = useState('Tutti');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Essenziali');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Tutti') return checklist;
    return checklist.filter(item => item.category === activeCategory);
  }, [checklist, activeCategory]);

  const checkedCount = checklist.filter(i => i.checked).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? checkedCount / totalCount : 0;

  const handleToggle = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleChecklistItem(id);
  }, [toggleChecklistItem]);

  const handleAddItem = useCallback(() => {
    if (!newItemName.trim()) return;
    addChecklistItem({
      id: `custom_${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      checked: false,
    });
    setNewItemName('');
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newItemName, newItemCategory, addChecklistItem]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof filteredItems> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.pillRow}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, activeCategory === cat && styles.pillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.pillText, activeCategory === cat && styles.pillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.progressCard}>
          <LinearGradient
            colors={['#4DD0E1', '#7B68EE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.progressGradient}
          >
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>{checkedCount} di {totalCount} preparati</Text>
              <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
            </View>
            <View style={styles.progressBarOuter}>
              <View style={[styles.progressBarInner, { width: `${progress * 100}%` }]} />
            </View>
          </LinearGradient>
        </View>

        {Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.checkItem}
                onPress={() => handleToggle(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                  {item.checked && <Check color={Colors.white} size={14} />}
                </View>
                <Text style={[styles.checkText, item.checked && styles.checkTextChecked]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.85}
      >
        <Plus color={Colors.white} size={24} />
      </TouchableOpacity>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Aggiungi Articolo</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nome articolo"
              placeholderTextColor={Colors.textLight}
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
            />
            <View style={styles.catSelector}>
              {categories.filter(c => c !== 'Tutti').map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, newItemCategory === cat && styles.catPillActive]}
                  onPress={() => setNewItemCategory(cat)}
                >
                  <Text style={[styles.catPillText, newItemCategory === cat && styles.catPillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
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
  pillRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.coral,
    borderColor: Colors.coral,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
  },
  progressCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: 20,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  progressBarOuter: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 6,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  checkText: {
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
  },
  checkTextChecked: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.coral,
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
    marginBottom: 16,
  },
  catSelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.background,
  },
  catPillActive: {
    backgroundColor: Colors.teal,
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  catPillTextActive: {
    color: Colors.white,
  },
  addBtn: {
    backgroundColor: Colors.coral,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
