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
import {
  Search,
  Plug,
  Zap,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Globe,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { adaptersByCountry, plugTypeDescriptions, AdapterInfo } from '@/constants/adapters';

function PlugTypeBadge({ type }: { type: string }) {
  const info = plugTypeDescriptions[type];
  return (
    <View style={styles.plugBadge}>
      <Text style={styles.plugBadgeType}>{type}</Text>
      {info && <Text style={styles.plugBadgeDesc}>{info.description}</Text>}
    </View>
  );
}

function CountryAdapterCard({
  info,
  expanded,
  onToggle,
}: {
  info: AdapterInfo;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.countryCard}>
      <TouchableOpacity style={styles.countryHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.countryLeft}>
          <Text style={styles.countryFlag}>{info.flag}</Text>
          <View style={styles.countryInfo}>
            <Text style={styles.countryName}>{info.country}</Text>
            <View style={styles.countryMeta}>
              <View style={styles.voltageChip}>
                <Zap size={10} color="#FF9800" />
                <Text style={styles.voltageText}>{info.voltage}</Text>
              </View>
              {info.euroCompatible ? (
                <View style={[styles.compatChip, { backgroundColor: '#E8F5E9' }]}>
                  <CheckCircle size={10} color="#4CAF50" />
                  <Text style={[styles.compatText, { color: '#2E7D32' }]}>Compatibile</Text>
                </View>
              ) : (
                <View style={[styles.compatChip, { backgroundColor: '#FFEBEE' }]}>
                  <XCircle size={10} color="#E53935" />
                  <Text style={[styles.compatText, { color: '#C62828' }]}>Adattatore</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        {expanded ? (
          <ChevronUp size={20} color={Colors.textSecondary} />
        ) : (
          <ChevronDown size={20} color={Colors.textSecondary} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.countryBody}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Plug size={16} color="#5E35B1" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tipi di presa</Text>
              <View style={styles.plugTypesList}>
                {info.plugTypes.map((type) => (
                  <PlugTypeBadge key={type} type={type} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Zap size={16} color="#FF9800" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Tensione e Frequenza</Text>
              <Text style={styles.detailValue}>{info.voltage} / {info.frequency}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              {info.euroCompatible ? (
                <CheckCircle size={16} color="#4CAF50" />
              ) : (
                <AlertTriangle size={16} color="#E53935" />
              )}
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Compatibilità EU</Text>
              <Text style={[styles.detailValue, { color: info.euroCompatible ? '#2E7D32' : '#C62828' }]}>
                {info.euroCompatible ? 'Compatibile con dispositivi europei' : 'NON compatibile - serve adattatore'}
              </Text>
            </View>
          </View>

          <View style={[styles.adapterBox, { backgroundColor: info.euroCompatible ? '#E8F5E9' : '#FFF3E0' }]}>
            <View style={styles.adapterBoxHeader}>
              <Plug size={16} color={info.euroCompatible ? '#2E7D32' : '#E65100'} />
              <Text style={[styles.adapterBoxTitle, { color: info.euroCompatible ? '#2E7D32' : '#E65100' }]}>
                Adattatore Necessario
              </Text>
            </View>
            <Text style={[styles.adapterBoxText, { color: info.euroCompatible ? '#33691E' : '#BF360C' }]}>
              {info.adapterNeeded}
            </Text>
          </View>

          <View style={styles.notesBox}>
            <Info size={14} color="#1565C0" />
            <Text style={styles.notesText}>{info.notes}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function PowerAdaptersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return adaptersByCountry;
    return adaptersByCountry.filter((c) =>
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleToggle = useCallback((country: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedCountry((prev) => (prev === country ? null : country));
  }, []);

  const compatibleCount = adaptersByCountry.filter((c) => c.euroCompatible).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#E65100', '#F57C00', '#FFB300']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroIconRow}>
          <View style={styles.heroIconCircle}>
            <Plug size={28} color="#fff" />
          </View>
          <View style={styles.heroZapIcon}>
            <Zap size={16} color="rgba(255,255,255,0.7)" />
          </View>
        </View>
        <Text style={styles.heroTitle}>Adattatori & Tensione</Text>
        <Text style={styles.heroSub}>
          Scopri quale presa e tensione elettrica troverai a destinazione
        </Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStatItem}>
            <Globe size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroStatText}>{adaptersByCountry.length} paesi</Text>
          </View>
          <View style={styles.heroStatItem}>
            <CheckCircle size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroStatText}>{compatibleCount} compatibili EU</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Search size={18} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca paese..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="search-adapter-input"
        />
      </View>

      <View style={styles.quickLegend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendLabel}>Compatibile con prese europee</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#E53935' }]} />
          <Text style={styles.legendLabel}>Serve adattatore</Text>
        </View>
      </View>

      <View style={styles.listSection}>
        {filteredCountries.map((info) => (
          <CountryAdapterCard
            key={info.country}
            info={info}
            expanded={expandedCountry === info.country}
            onToggle={() => handleToggle(info.country)}
          />
        ))}
      </View>

      {filteredCountries.length === 0 && (
        <View style={styles.emptyState}>
          <Search size={40} color={Colors.textLight} />
          <Text style={styles.emptyText}>Nessun paese trovato</Text>
        </View>
      )}

      <View style={styles.tipCard}>
        <Zap size={18} color="#E65100" />
        <Text style={styles.tipText}>
          Consiglio: porta sempre un adattatore universale quando viaggi. Verifica che i tuoi dispositivi supportino 100-240V prima di partire.
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
  heroCard: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  heroIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroZapIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#fff',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginBottom: 16,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 20,
  },
  heroStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroStatText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.9)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  quickLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  listSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  countryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  countryFlag: {
    fontSize: 32,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  countryMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  voltageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  voltageText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#F57F17',
  },
  compatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  compatText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  countryBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    gap: 14,
    paddingTop: 14,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  plugTypesList: {
    gap: 6,
  },
  plugBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  plugBadgeType: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#6A1B9A',
    width: 24,
  },
  plugBadgeDesc: {
    fontSize: 12,
    color: '#7B1FA2',
    fontWeight: '500' as const,
  },
  adapterBox: {
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  adapterBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adapterBoxTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  adapterBoxText: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  notesBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '600' as const,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 14,
    padding: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
  },
});
