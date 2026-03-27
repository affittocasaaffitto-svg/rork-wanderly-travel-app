import React, { useState, useCallback, useMemo } from 'react';
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
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Droplets,
  Wind,
  CloudSun,
  Search,
  ThermometerSun,
  Umbrella,
  CheckCircle,
  XCircle,
  Lightbulb,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { climateDestinations } from '@/constants/climate';
import { ClimateCondition, MonthClimate } from '@/types';

const conditionIcons: Record<ClimateCondition, React.ComponentType<{ color: string; size: number }>> = {
  sunny: Sun,
  partly_cloudy: CloudSun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  snowy: Snowflake,
  humid: Droplets,
  dry: Wind,
  windy: Wind,
};

function getTempColor(temp: number): string {
  if (temp <= 0) return '#4FC3F7';
  if (temp <= 10) return '#29B6F6';
  if (temp <= 15) return '#26C6DA';
  if (temp <= 20) return '#66BB6A';
  if (temp <= 25) return '#FDD835';
  if (temp <= 30) return '#FFA726';
  if (temp <= 35) return '#FF7043';
  return '#E53935';
}

function getTempBarWidth(temp: number, min: number, max: number): number {
  const range = max - min;
  if (range === 0) return 50;
  return Math.max(10, Math.min(100, ((temp - min) / range) * 100));
}

export default function ClimateGuideScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return climateDestinations;
    const q = searchQuery.toLowerCase();
    return climateDestinations.filter(
      d => d.country.toLowerCase().includes(q) || d.city.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const destination = filteredDestinations[selectedIndex] ?? filteredDestinations[0];

  const handleSelect = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIndex(index);
  }, []);

  const globalMin = useMemo(() => {
    if (!destination) return -10;
    return Math.min(...destination.months.map(m => m.tempMin));
  }, [destination]);

  const globalMax = useMemo(() => {
    if (!destination) return 40;
    return Math.max(...destination.months.map(m => m.tempMax));
  }, [destination]);

  const bestMonths = useMemo(() => {
    if (!destination) return [];
    return destination.months.filter(m => m.isBest).map(m => m.monthShort);
  }, [destination]);

  const worstMonths = useMemo(() => {
    if (!destination) return [];
    return destination.months.filter(m => m.isWorst).map(m => m.monthShort);
  }, [destination]);

  if (!destination) {
    return (
      <View style={styles.emptyContainer}>
        <Search color={Colors.textLight} size={48} />
        <Text style={styles.emptyText}>Nessuna destinazione trovata</Text>
        <TextInput
          style={styles.searchInputStandalone}
          placeholder="Cerca paese o città..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setSelectedIndex(0);
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Search color={Colors.textLight} size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca paese o città..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setSelectedIndex(0);
            }}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillsRow}
        contentContainerStyle={styles.pillsContent}
      >
        {filteredDestinations.map((d, i) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.pill, selectedIndex === i && styles.pillActive]}
            onPress={() => handleSelect(i)}
          >
            <Text style={styles.pillFlag}>{d.flag}</Text>
            <Text style={[styles.pillText, selectedIndex === i && styles.pillTextActive]}>
              {d.city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.tipCard}>
        <LinearGradient
          colors={['#1565C0', '#0D47A1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tipGradient}
        >
          <View style={styles.tipIcon}>
            <Lightbulb color="#FFD54F" size={20} />
          </View>
          <Text style={styles.tipText}>{destination.quickTip}</Text>
        </LinearGradient>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
          <Text style={styles.legendLabel}>Periodo migliore</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#C62828' }]} />
          <Text style={styles.legendLabel}>Da evitare</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <CheckCircle color="#2E7D32" size={16} />
          <Text style={styles.summaryLabel}>Ideale</Text>
          <Text style={styles.summaryValue}>{bestMonths.join(', ')}</Text>
        </View>
        <View style={styles.summaryCard}>
          <XCircle color="#C62828" size={16} />
          <Text style={styles.summaryLabel}>Evita</Text>
          <Text style={styles.summaryValue}>{worstMonths.length > 0 ? worstMonths.join(', ') : '—'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Clima Mese per Mese</Text>

      {destination.months.map((month, idx) => (
        <MonthCard
          key={idx}
          month={month}
          globalMin={globalMin}
          globalMax={globalMax}
        />
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function MonthCard({ month, globalMin, globalMax }: {
  month: MonthClimate;
  globalMin: number;
  globalMax: number;
}) {
  const Icon = conditionIcons[month.condition] || Sun;
  const minColor = getTempColor(month.tempMin);
  const maxColor = getTempColor(month.tempMax);

  const barLeft = getTempBarWidth(month.tempMin, globalMin, globalMax);
  const barRight = getTempBarWidth(month.tempMax, globalMin, globalMax);

  let cardStyle = styles.monthCard;
  let borderStyle = {};
  if (month.isBest) {
    borderStyle = { borderLeftWidth: 4, borderLeftColor: '#2E7D32' };
  } else if (month.isWorst) {
    borderStyle = { borderLeftWidth: 4, borderLeftColor: '#C62828' };
  }

  return (
    <View style={[cardStyle, borderStyle]}>
      <View style={styles.monthHeader}>
        <View style={styles.monthNameRow}>
          <Text style={styles.monthName}>{month.monthShort}</Text>
          {month.isBest && (
            <View style={styles.bestBadge}>
              <CheckCircle color="#FFF" size={10} />
              <Text style={styles.bestBadgeText}>Periodo migliore</Text>
            </View>
          )}
          {month.isWorst && (
            <View style={styles.worstBadge}>
              <XCircle color="#FFF" size={10} />
              <Text style={styles.worstBadgeText}>Sconsigliato</Text>
            </View>
          )}
        </View>
        <View style={styles.monthIconRow}>
          <Icon color={getTempColor((month.tempMin + month.tempMax) / 2)} size={20} />
          <Text style={styles.conditionLabel}>{month.conditionLabel}</Text>
        </View>
      </View>

      <View style={styles.tempBarRow}>
        <View style={styles.tempLabelCol}>
          <ThermometerSun color={minColor} size={14} />
          <Text style={[styles.tempValue, { color: minColor }]}>{month.tempMin}°</Text>
        </View>
        <View style={styles.tempBarTrack}>
          <View
            style={[
              styles.tempBarFill,
              {
                left: `${barLeft}%`,
                width: `${Math.max(5, barRight - barLeft)}%`,
                backgroundColor: maxColor,
              },
            ]}
          />
        </View>
        <View style={styles.tempLabelCol}>
          <Text style={[styles.tempValue, { color: maxColor }]}>{month.tempMax}°</Text>
        </View>
      </View>

      <View style={styles.monthStatsRow}>
        <View style={styles.monthStat}>
          <Umbrella color="#42A5F5" size={14} />
          <Text style={styles.monthStatText}>{month.precipitation} mm</Text>
        </View>
      </View>

      {month.isWorst && month.worstReason && (
        <View style={styles.worstReasonRow}>
          <Text style={styles.worstReasonText}>⚠️ {month.worstReason}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  searchInputStandalone: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  pillsRow: {
    maxHeight: 56,
  },
  pillsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },
  pillFlag: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
  },
  tipCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
    lineHeight: 20,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  monthCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    width: 36,
  },
  bestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bestBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  worstBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#C62828',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  worstBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  monthIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conditionLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  tempBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tempLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    minWidth: 44,
  },
  tempBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F4F8',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  tempBarFill: {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    borderRadius: 4,
    opacity: 0.8,
  },
  tempValue: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  monthStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  monthStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthStatText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  worstReasonRow: {
    marginTop: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  worstReasonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#C62828',
  },
});
