import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Receipt, Users, Percent, ChevronDown, ChevronUp, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface CountryTip {
  country: string;
  flag: string;
  percentage: number;
  note: string;
}

const COUNTRY_TIPS: CountryTip[] = [
  { country: 'Italia', flag: '🇮🇹', percentage: 10, note: 'Coperto spesso incluso. Mancia apprezzata ma non obbligatoria.' },
  { country: 'USA', flag: '🇺🇸', percentage: 20, note: 'Mancia obbligatoria: 15-25% al ristorante.' },
  { country: 'UK', flag: '🇬🇧', percentage: 12, note: 'Service charge spesso incluso. Altrimenti 10-15%.' },
  { country: 'Francia', flag: '🇫🇷', percentage: 10, note: 'Service compris nella maggior parte dei ristoranti.' },
  { country: 'Germania', flag: '🇩🇪', percentage: 10, note: 'Arrotondare o lasciare 5-10%.' },
  { country: 'Giappone', flag: '🇯🇵', percentage: 0, note: 'Mai lasciare mancia! È considerato scortese.' },
  { country: 'Spagna', flag: '🇪🇸', percentage: 8, note: 'Non obbligatoria ma apprezzata. 5-10%.' },
  { country: 'Messico', flag: '🇲🇽', percentage: 15, note: 'Propina del 10-20% al ristorante.' },
  { country: 'Australia', flag: '🇦🇺', percentage: 10, note: 'Non obbligatoria. 10% per ottimo servizio.' },
  { country: 'Thailandia', flag: '🇹🇭', percentage: 10, note: 'Arrotondare il conto nei ristoranti turistici.' },
  { country: 'Brasile', flag: '🇧🇷', percentage: 10, note: 'Taxa de serviço del 10% spesso inclusa.' },
  { country: 'Egitto', flag: '🇪🇬', percentage: 15, note: 'Bakshish atteso ovunque: 10-15%.' },
];

const QUICK_PERCENTAGES = [5, 10, 15, 20, 25];

export default function TipCalculatorScreen() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [splitCount, setSplitCount] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<CountryTip | null>(null);
  const [showCountries, setShowCountries] = useState(false);

  const calculations = useMemo(() => {
    const bill = parseFloat(billAmount) || 0;
    const tipAmount = bill * (tipPercent / 100);
    const total = bill + tipAmount;
    const perPerson = splitCount > 0 ? total / splitCount : total;
    const tipPerPerson = splitCount > 0 ? tipAmount / splitCount : tipAmount;
    return { tipAmount, total, perPerson, tipPerPerson };
  }, [billAmount, tipPercent, splitCount]);

  const handleCountrySelect = useCallback((country: CountryTip) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCountry(country);
    setTipPercent(country.percentage);
    setShowCountries(false);
  }, []);

  const handleQuickPercent = useCallback((pct: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTipPercent(pct);
    setSelectedCountry(null);
  }, []);

  const adjustSplit = useCallback((delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSplitCount(prev => Math.max(1, Math.min(20, prev + delta)));
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Importo del Conto</Text>
        <View style={styles.amountRow}>
          <Text style={styles.currencySymbol}>€</Text>
          <TextInput
            style={styles.amountInput}
            value={billAmount}
            onChangeText={setBillAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={Colors.textLight}
            testID="bill-input"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.countrySelector}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowCountries(!showCountries);
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#4DD0E1', '#26C6DA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.countrySelectorGradient}
        >
          <View style={styles.countrySelectorLeft}>
            <Text style={styles.countrySelectorFlag}>
              {selectedCountry ? selectedCountry.flag : '🌍'}
            </Text>
            <View>
              <Text style={styles.countrySelectorLabel}>Paese</Text>
              <Text style={styles.countrySelectorValue}>
                {selectedCountry ? selectedCountry.country : 'Seleziona Paese'}
              </Text>
            </View>
          </View>
          {showCountries ? (
            <ChevronUp color={Colors.white} size={20} />
          ) : (
            <ChevronDown color={Colors.white} size={20} />
          )}
        </LinearGradient>
      </TouchableOpacity>

      {showCountries && (
        <View style={styles.countryList}>
          {COUNTRY_TIPS.map((c) => (
            <TouchableOpacity
              key={c.country}
              style={[
                styles.countryItem,
                selectedCountry?.country === c.country && styles.countryItemActive,
              ]}
              onPress={() => handleCountrySelect(c)}
            >
              <Text style={styles.countryFlag}>{c.flag}</Text>
              <View style={styles.countryInfo}>
                <Text style={styles.countryName}>{c.country}</Text>
                <Text style={styles.countryNote} numberOfLines={1}>{c.note}</Text>
              </View>
              <View style={styles.countryPercent}>
                <Text style={styles.countryPercentText}>{c.percentage}%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedCountry && (
        <View style={styles.tipInfoCard}>
          <Info color={Colors.teal} size={16} />
          <Text style={styles.tipInfoText}>{selectedCountry.note}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Percentuale Mancia</Text>
      <View style={styles.quickRow}>
        {QUICK_PERCENTAGES.map((pct) => (
          <TouchableOpacity
            key={pct}
            style={[styles.quickPill, tipPercent === pct && styles.quickPillActive]}
            onPress={() => handleQuickPercent(pct)}
          >
            <Text style={[styles.quickPillText, tipPercent === pct && styles.quickPillTextActive]}>
              {pct}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sliderRow}>
        <Percent color={Colors.textSecondary} size={16} />
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${(tipPercent / 30) * 100}%` }]} />
        </View>
        <Text style={styles.sliderValue}>{tipPercent}%</Text>
      </View>
      <View style={styles.sliderButtons}>
        <TouchableOpacity
          style={styles.sliderBtn}
          onPress={() => { setTipPercent(prev => Math.max(0, prev - 1)); setSelectedCountry(null); }}
        >
          <Text style={styles.sliderBtnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sliderBtn}
          onPress={() => { setTipPercent(prev => Math.min(30, prev + 1)); setSelectedCountry(null); }}
        >
          <Text style={styles.sliderBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Dividi il Conto</Text>
      <View style={styles.splitCard}>
        <Users color={Colors.purple} size={22} />
        <TouchableOpacity style={styles.splitBtn} onPress={() => adjustSplit(-1)}>
          <Text style={styles.splitBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.splitCount}>{splitCount}</Text>
        <TouchableOpacity style={styles.splitBtn} onPress={() => adjustSplit(1)}>
          <Text style={styles.splitBtnText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.splitLabel}>{splitCount === 1 ? 'persona' : 'persone'}</Text>
      </View>

      <LinearGradient
        colors={['#7B68EE', '#4DD0E1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.resultCard}
      >
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Mancia</Text>
          <Text style={styles.resultValue}>€{calculations.tipAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.resultDivider} />
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Totale</Text>
          <Text style={styles.resultValueLarge}>€{calculations.total.toFixed(2)}</Text>
        </View>
        {splitCount > 1 && (
          <>
            <View style={styles.resultDivider} />
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Per persona</Text>
              <Text style={styles.resultValue}>€{calculations.perPerson.toFixed(2)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabelSmall}>Mancia per persona</Text>
              <Text style={styles.resultValueSmall}>€{calculations.tipPerPerson.toFixed(2)}</Text>
            </View>
          </>
        )}
      </LinearGradient>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  inputCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.teal,
  },
  amountInput: {
    flex: 1,
    fontSize: 42,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  countrySelector: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  countrySelectorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  countrySelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countrySelectorFlag: {
    fontSize: 28,
  },
  countrySelectorLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500' as const,
  },
  countrySelectorValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  countryList: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginTop: 8,
    overflow: 'hidden',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  countryItemActive: {
    backgroundColor: Colors.tealLight,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  countryNote: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  countryPercent: {
    backgroundColor: Colors.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countryPercentText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.tealDark,
  },
  tipInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.tealLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  tipInfoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.tealDark,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  quickPillActive: {
    backgroundColor: Colors.coral,
    borderColor: Colors.coral,
  },
  quickPillText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  quickPillTextActive: {
    color: Colors.white,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.coral,
    borderRadius: 3,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    width: 40,
    textAlign: 'right',
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
  },
  sliderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sliderBtnText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  splitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  splitBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitBtnText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.purple,
  },
  splitCount: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  splitLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resultCard: {
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.85)',
  },
  resultLabelSmall: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  resultValueLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  resultValueSmall: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.8)',
  },
  resultDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 10,
  },
});
