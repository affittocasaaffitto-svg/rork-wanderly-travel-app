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
import { ArrowUpDown, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { currencies } from '@/constants/currencies';

export default function ConverterScreen() {
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [amount, setAmount] = useState('100');

  const fromCurrency = currencies[fromIndex];
  const toCurrency = currencies[toIndex];

  const convertedAmount = useMemo(() => {
    const num = parseFloat(amount) || 0;
    const inEUR = num / fromCurrency.rate;
    return (inEUR * toCurrency.rate).toFixed(2);
  }, [amount, fromCurrency, toCurrency]);

  const exchangeRate = useMemo(() => {
    return (toCurrency.rate / fromCurrency.rate).toFixed(4);
  }, [fromCurrency, toCurrency]);

  const handleSwap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFromIndex(toIndex);
    setToIndex(fromIndex);
  }, [fromIndex, toIndex]);

  const handleSelectCurrency = useCallback((isFrom: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isFrom) {
      setFromIndex((fromIndex + 1) % currencies.length);
    } else {
      setToIndex((toIndex + 1) % currencies.length);
    }
  }, [fromIndex, toIndex]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.currencyRow} onPress={() => handleSelectCurrency(true)}>
          <Text style={styles.flag}>{fromCurrency.flag}</Text>
          <Text style={styles.currencyCode}>{fromCurrency.code}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={Colors.textLight}
        />
        <Text style={styles.currencyName}>{fromCurrency.name}</Text>
      </View>

      <View style={styles.exchangeSection}>
        <LinearGradient
          colors={['#7B68EE', '#FF8A80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.exchangeCard}
        >
          <Text style={styles.exchangeText}>
            1 {fromCurrency.code} = {exchangeRate} {toCurrency.code}
          </Text>
          <TouchableOpacity onPress={handleSwap} style={styles.swapBtn}>
            <ArrowUpDown color={Colors.white} size={20} />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.currencyRow} onPress={() => handleSelectCurrency(false)}>
          <Text style={styles.flag}>{toCurrency.flag}</Text>
          <Text style={styles.currencyCode}>{toCurrency.code}</Text>
        </TouchableOpacity>
        <Text style={styles.resultAmount}>{convertedAmount}</Text>
        <Text style={styles.currencyName}>{toCurrency.name}</Text>
      </View>

      <Text style={styles.sectionTitle}>Coppie Preferite</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pairsRow}>
        {[
          { from: 0, to: 1, color: Colors.teal },
          { from: 2, to: 0, color: Colors.purple },
          { from: 3, to: 1, color: Colors.coral },
          { from: 4, to: 0, color: Colors.teal },
        ].map((pair, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.pairPill, { backgroundColor: pair.color }]}
            onPress={() => {
              setFromIndex(pair.from);
              setToIndex(pair.to);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.pairText}>
              {currencies[pair.from].code}/{currencies[pair.to].code}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.ratesCard}>
        <View style={styles.ratesHeader}>
          <Text style={styles.ratesTitle}>Tassi di Cambio</Text>
          <RefreshCw color={Colors.textLight} size={16} />
        </View>
        {currencies.map((curr) => (
          <View key={curr.code} style={styles.rateRow}>
            <Text style={styles.rateFlag}>{curr.flag}</Text>
            <Text style={styles.rateCode}>{curr.code}</Text>
            <Text style={styles.rateName}>{curr.name}</Text>
            <Text style={styles.rateValue}>{curr.rate.toFixed(2)}</Text>
          </View>
        ))}
      </View>

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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  flag: {
    fontSize: 28,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  amountInput: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    marginBottom: 4,
  },
  resultAmount: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: Colors.teal,
    textAlign: 'center',
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
    color: Colors.textLight,
  },
  exchangeSection: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  exchangeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  exchangeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  pairsRow: {
    marginBottom: 8,
  },
  pairPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  pairText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  ratesCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  ratesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratesTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  rateFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  rateCode: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    width: 40,
  },
  rateName: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
});
