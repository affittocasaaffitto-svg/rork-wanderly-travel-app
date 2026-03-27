import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ArrowUpDown, Ruler, Thermometer, Weight, Droplets, Gauge } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface UnitCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  color: string;
  units: UnitPair[];
}

interface UnitPair {
  fromLabel: string;
  fromSymbol: string;
  toLabel: string;
  toSymbol: string;
  convert: (v: number) => number;
  reverse: (v: number) => number;
}

const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    label: 'Lunghezza',
    icon: Ruler,
    color: '#4DD0E1',
    units: [
      {
        fromLabel: 'Chilometri', fromSymbol: 'km',
        toLabel: 'Miglia', toSymbol: 'mi',
        convert: (v) => v * 0.621371,
        reverse: (v) => v / 0.621371,
      },
      {
        fromLabel: 'Metri', fromSymbol: 'm',
        toLabel: 'Piedi', toSymbol: 'ft',
        convert: (v) => v * 3.28084,
        reverse: (v) => v / 3.28084,
      },
      {
        fromLabel: 'Centimetri', fromSymbol: 'cm',
        toLabel: 'Pollici', toSymbol: 'in',
        convert: (v) => v * 0.393701,
        reverse: (v) => v / 0.393701,
      },
    ],
  },
  {
    id: 'weight',
    label: 'Peso',
    icon: Weight,
    color: '#7B68EE',
    units: [
      {
        fromLabel: 'Chilogrammi', fromSymbol: 'kg',
        toLabel: 'Libbre', toSymbol: 'lb',
        convert: (v) => v * 2.20462,
        reverse: (v) => v / 2.20462,
      },
      {
        fromLabel: 'Grammi', fromSymbol: 'g',
        toLabel: 'Once', toSymbol: 'oz',
        convert: (v) => v * 0.035274,
        reverse: (v) => v / 0.035274,
      },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperatura',
    icon: Thermometer,
    color: '#FF8A80',
    units: [
      {
        fromLabel: 'Celsius', fromSymbol: '°C',
        toLabel: 'Fahrenheit', toSymbol: '°F',
        convert: (v) => (v * 9 / 5) + 32,
        reverse: (v) => (v - 32) * 5 / 9,
      },
      {
        fromLabel: 'Celsius', fromSymbol: '°C',
        toLabel: 'Kelvin', toSymbol: 'K',
        convert: (v) => v + 273.15,
        reverse: (v) => v - 273.15,
      },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    icon: Droplets,
    color: '#66BB6A',
    units: [
      {
        fromLabel: 'Litri', fromSymbol: 'L',
        toLabel: 'Galloni (US)', toSymbol: 'gal',
        convert: (v) => v * 0.264172,
        reverse: (v) => v / 0.264172,
      },
      {
        fromLabel: 'Millilitri', fromSymbol: 'mL',
        toLabel: 'Fl. Oz (US)', toSymbol: 'fl oz',
        convert: (v) => v * 0.033814,
        reverse: (v) => v / 0.033814,
      },
    ],
  },
  {
    id: 'speed',
    label: 'Velocità',
    icon: Gauge,
    color: '#FFB74D',
    units: [
      {
        fromLabel: 'km/h', fromSymbol: 'km/h',
        toLabel: 'mph', toSymbol: 'mph',
        convert: (v) => v * 0.621371,
        reverse: (v) => v / 0.621371,
      },
      {
        fromLabel: 'm/s', fromSymbol: 'm/s',
        toLabel: 'km/h', toSymbol: 'km/h',
        convert: (v) => v * 3.6,
        reverse: (v) => v / 3.6,
      },
    ],
  },
];

export default function UnitsScreen() {
  const [activeCategoryId, setActiveCategoryId] = useState('length');
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [inputValue, setInputValue] = useState('1');
  const [reversed, setReversed] = useState(false);

  const activeCategory = useMemo(
    () => UNIT_CATEGORIES.find(c => c.id === activeCategoryId)!,
    [activeCategoryId]
  );
  const activeUnit = activeCategory.units[activeUnitIndex];

  const result = useMemo(() => {
    const num = parseFloat(inputValue) || 0;
    const converted = reversed ? activeUnit.reverse(num) : activeUnit.convert(num);
    return converted;
  }, [inputValue, activeUnit, reversed]);

  const handleSwap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReversed(prev => !prev);
  }, []);

  const handleCategoryChange = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCategoryId(id);
    setActiveUnitIndex(0);
    setReversed(false);
    setInputValue('1');
  }, []);

  const handleUnitChange = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveUnitIndex(index);
    setReversed(false);
    setInputValue('1');
  }, []);

  const fromLabel = reversed ? activeUnit.toLabel : activeUnit.fromLabel;
  const fromSymbol = reversed ? activeUnit.toSymbol : activeUnit.fromSymbol;
  const toLabel = reversed ? activeUnit.fromLabel : activeUnit.toLabel;
  const toSymbol = reversed ? activeUnit.fromSymbol : activeUnit.toSymbol;

  const formatResult = (num: number) => {
    if (Math.abs(num) < 0.001 && num !== 0) return num.toExponential(3);
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
        contentContainerStyle={styles.categoryRowContent}
      >
        {UNIT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = cat.id === activeCategoryId;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryPill, isActive && { backgroundColor: cat.color }]}
              onPress={() => handleCategoryChange(cat.id)}
            >
              <Icon color={isActive ? Colors.white : Colors.textSecondary} size={16} />
              <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {activeCategory.units.length > 1 && (
        <View style={styles.unitTabs}>
          {activeCategory.units.map((unit, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.unitTab, activeUnitIndex === index && styles.unitTabActive]}
              onPress={() => handleUnitChange(index)}
            >
              <Text style={[
                styles.unitTabText,
                activeUnitIndex === index && styles.unitTabTextActive,
              ]}>
                {unit.fromSymbol} → {unit.toSymbol}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.converterCard}>
        <View style={styles.unitSection}>
          <Text style={styles.unitLabel}>{fromLabel}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.valueInput}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.textLight}
            />
            <Text style={[styles.unitSymbol, { color: activeCategory.color }]}>{fromSymbol}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <LinearGradient
            colors={[activeCategory.color, activeCategory.color + 'CC']}
            style={styles.swapGradient}
          >
            <ArrowUpDown color={Colors.white} size={20} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.unitSection}>
          <Text style={styles.unitLabel}>{toLabel}</Text>
          <View style={styles.resultRow}>
            <Text style={[styles.resultValue, { color: activeCategory.color }]}>
              {formatResult(result)}
            </Text>
            <Text style={[styles.unitSymbol, { color: activeCategory.color }]}>{toSymbol}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Conversioni Rapide</Text>
      <View style={styles.quickGrid}>
        {[1, 5, 10, 25, 50, 100].map((val) => {
          const num = reversed ? activeUnit.reverse(val) : activeUnit.convert(val);
          return (
            <TouchableOpacity
              key={val}
              style={styles.quickCard}
              onPress={() => {
                setInputValue(val.toString());
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.quickFrom}>{val} {fromSymbol}</Text>
              <Text style={[styles.quickTo, { color: activeCategory.color }]}>
                {formatResult(num)} {toSymbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Formula</Text>
        <Text style={styles.infoText}>
          1 {fromSymbol} = {formatResult(reversed ? activeUnit.reverse(1) : activeUnit.convert(1))} {toSymbol}
        </Text>
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
  categoryRow: {
    marginTop: 8,
  },
  categoryRowContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: 8,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  categoryPillTextActive: {
    color: Colors.white,
  },
  unitTabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  unitTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  unitTabActive: {
    borderColor: Colors.teal,
    backgroundColor: Colors.tealLight,
  },
  unitTabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  unitTabTextActive: {
    color: Colors.tealDark,
  },
  converterCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    margin: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  unitSection: {
    paddingVertical: 8,
  },
  unitLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueInput: {
    flex: 1,
    fontSize: 38,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  unitSymbol: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultValue: {
    flex: 1,
    fontSize: 38,
    fontWeight: '800' as const,
  },
  swapButton: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  swapGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  quickCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    width: '31%',
    flexGrow: 1,
    alignItems: 'center',
  },
  quickFrom: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  quickTo: {
    fontSize: 14,
    fontWeight: '700' as const,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
});
