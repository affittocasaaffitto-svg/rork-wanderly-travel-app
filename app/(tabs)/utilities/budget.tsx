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
import {
  Wallet, Plus, X, Utensils, Hotel, Train, ShoppingBag,
  Camera, Ticket, Coffee, Trash2,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

const CATEGORIES = [
  { id: 'cibo', label: 'Cibo', icon: Utensils, color: '#FF8A80' },
  { id: 'alloggio', label: 'Alloggio', icon: Hotel, color: '#7B68EE' },
  { id: 'trasporti', label: 'Trasporti', icon: Train, color: '#4DD0E1' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#FFB74D' },
  { id: 'attivita', label: 'Attività', icon: Camera, color: '#66BB6A' },
  { id: 'biglietti', label: 'Biglietti', icon: Ticket, color: '#AB47BC' },
  { id: 'altro', label: 'Altro', icon: Coffee, color: '#78909C' },
];

export default function BudgetScreen() {
  const [totalBudget, setTotalBudget] = useState('1000');
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: 'Hotel 3 notti', amount: 270, category: 'alloggio', date: '2026-02-15' },
    { id: '2', name: 'Volo A/R', amount: 180, category: 'trasporti', date: '2026-02-14' },
    { id: '3', name: 'Ristorante locale', amount: 45, category: 'cibo', date: '2026-02-15' },
    { id: '4', name: 'Museo Nazionale', amount: 15, category: 'biglietti', date: '2026-02-16' },
    { id: '5', name: 'Souvenir', amount: 30, category: 'shopping', date: '2026-02-16' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('cibo');
  const [editBudget, setEditBudget] = useState(false);

  const budget = parseFloat(totalBudget) || 0;
  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const remaining = budget - totalSpent;
  const spentPercent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return CATEGORIES.map(cat => ({
      ...cat,
      total: map[cat.id] || 0,
      percent: totalSpent > 0 ? ((map[cat.id] || 0) / totalSpent) * 100 : 0,
    })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  }, [expenses, totalSpent]);

  const handleAddExpense = useCallback(() => {
    if (!newName.trim() || !newAmount.trim()) return;
    const expense: Expense = {
      id: Date.now().toString(),
      name: newName.trim(),
      amount: parseFloat(newAmount) || 0,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses(prev => [expense, ...prev]);
    setNewName('');
    setNewAmount('');
    setShowModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newName, newAmount, newCategory]);

  const handleDelete = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const getCategoryInfo = useCallback((catId: string) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[6];
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={remaining >= 0 ? ['#4DD0E1', '#26C6DA'] : ['#FF5252', '#FF8A80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Budget Totale</Text>
              {editBudget ? (
                <View style={styles.budgetEditRow}>
                  <Text style={styles.heroCurrency}>€</Text>
                  <TextInput
                    style={styles.budgetInput}
                    value={totalBudget}
                    onChangeText={setTotalBudget}
                    keyboardType="numeric"
                    autoFocus
                    onBlur={() => setEditBudget(false)}
                  />
                </View>
              ) : (
                <TouchableOpacity onPress={() => setEditBudget(true)}>
                  <Text style={styles.heroBudget}>€{budget.toFixed(0)}</Text>
                </TouchableOpacity>
              )}
            </View>
            <Wallet color="rgba(255,255,255,0.8)" size={36} />
          </View>

          <View style={styles.progressOuter}>
            <View style={[styles.progressInner, { width: `${spentPercent}%` }]} />
          </View>

          <View style={styles.heroBottom}>
            <View>
              <Text style={styles.heroSmallLabel}>Speso</Text>
              <Text style={styles.heroSmallValue}>€{totalSpent.toFixed(2)}</Text>
            </View>
            <View style={styles.heroBottomRight}>
              <Text style={styles.heroSmallLabel}>Rimanente</Text>
              <Text style={[styles.heroSmallValue, remaining < 0 && styles.heroNegative]}>
                €{remaining.toFixed(2)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Ripartizione per Categoria</Text>
        <View style={styles.categoryGrid}>
          {categoryBreakdown.map((cat) => {
            const Icon = cat.icon;
            return (
              <View key={cat.id} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                  <Icon color={cat.color} size={18} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categoryAmount}>€{cat.total.toFixed(0)}</Text>
                <View style={styles.categoryBar}>
                  <View style={[styles.categoryBarFill, { width: `${cat.percent}%`, backgroundColor: cat.color }]} />
                </View>
                <Text style={styles.categoryPercent}>{cat.percent.toFixed(0)}%</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Spese Recenti</Text>
        {expenses.map((expense) => {
          const cat = getCategoryInfo(expense.category);
          const Icon = cat.icon;
          return (
            <View key={expense.id} style={styles.expenseCard}>
              <View style={[styles.expenseIcon, { backgroundColor: cat.color + '20' }]}>
                <Icon color={cat.color} size={18} />
              </View>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <Text style={styles.expenseDate}>{expense.date} · {cat.label}</Text>
              </View>
              <Text style={styles.expenseAmount}>-€{expense.amount.toFixed(2)}</Text>
              <TouchableOpacity
                onPress={() => handleDelete(expense.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.deleteBtn}
              >
                <Trash2 color={Colors.textLight} size={16} />
              </TouchableOpacity>
            </View>
          );
        })}

        {expenses.length === 0 && (
          <View style={styles.emptyState}>
            <Wallet color={Colors.textLight} size={40} />
            <Text style={styles.emptyText}>Nessuna spesa registrata</Text>
            <Text style={styles.emptySubtext}>Tocca + per aggiungere la prima spesa</Text>
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
              <Text style={styles.modalTitle}>Nuova Spesa</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Descrizione spesa"
              placeholderTextColor={Colors.textLight}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.amountInputRow}>
              <Text style={styles.amountPrefix}>€</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={Colors.textLight}
                value={newAmount}
                onChangeText={setNewAmount}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.catSelectorLabel}>Categoria</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.catOption,
                      newCategory === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color },
                    ]}
                    onPress={() => setNewCategory(cat.id)}
                  >
                    <Icon color={newCategory === cat.id ? cat.color : Colors.textLight} size={16} />
                    <Text style={[
                      styles.catOptionText,
                      newCategory === cat.id && { color: cat.color },
                    ]}>{cat.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.addBtnFull} onPress={handleAddExpense}>
              <Text style={styles.addBtnText}>Aggiungi Spesa</Text>
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
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500' as const,
  },
  heroBudget: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.white,
    marginTop: 4,
  },
  heroCurrency: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  budgetEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  budgetInput: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.white,
    minWidth: 100,
  },
  progressOuter: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  heroBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  heroBottomRight: {
    alignItems: 'flex-end',
  },
  heroSmallLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  heroSmallValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
    marginTop: 2,
  },
  heroNegative: {
    color: '#FFCDD2',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    width: '47%',
    flexGrow: 1,
  },
  categoryIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  categoryBar: {
    height: 4,
    backgroundColor: Colors.background,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  categoryPercent: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  expenseIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  expenseDate: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.coralDark,
  },
  deleteBtn: {
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
  emptySubtext: {
    fontSize: 13,
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
    marginBottom: 12,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  amountPrefix: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.teal,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    paddingVertical: 14,
  },
  catSelectorLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  catOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  catOptionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  addBtnFull: {
    backgroundColor: Colors.coral,
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
