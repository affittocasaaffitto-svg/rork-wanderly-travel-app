import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  Search,
  Syringe,
  Pill,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Heart,
  ChevronDown,
  ChevronUp,
  Hospital,
  Info,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { healthByCountry, HealthInfo } from '@/constants/health';

function VaccineCard({ vaccine }: { vaccine: { name: string; required: boolean; notes: string } }) {
  return (
    <View style={[styles.vaccineCard, vaccine.required && styles.vaccineCardRequired]}>
      <View style={styles.vaccineLeft}>
        <View style={[styles.vaccineIcon, { backgroundColor: vaccine.required ? '#FFEBEE' : '#F1F8E9' }]}>
          {vaccine.required ? (
            <AlertTriangle size={16} color="#E53935" />
          ) : (
            <ShieldCheck size={16} color="#7CB342" />
          )}
        </View>
        <View style={styles.vaccineInfo}>
          <View style={styles.vaccineNameRow}>
            <Text style={styles.vaccineName}>{vaccine.name}</Text>
            {vaccine.required && (
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>Consigliato</Text>
              </View>
            )}
          </View>
          <Text style={styles.vaccineNotes}>{vaccine.notes}</Text>
        </View>
      </View>
    </View>
  );
}

function CountryHealthCard({ info, expanded, onToggle }: { info: HealthInfo; expanded: boolean; onToggle: () => void }) {
  const handleCallEmergency = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (Platform.OS !== 'web') {
      Linking.openURL(`tel:${info.emergencyNumber}`);
    }
  }, [info.emergencyNumber]);

  return (
    <View style={styles.countryCard}>
      <TouchableOpacity style={styles.countryHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.countryLeft}>
          <Text style={styles.countryFlag}>{info.flag}</Text>
          <View>
            <Text style={styles.countryName}>{info.country}</Text>
            <Text style={styles.countryVaccineCount}>
              {info.vaccines.filter((v) => v.required).length} vaccini consigliati
            </Text>
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
          <View style={styles.detailSection}>
            <View style={styles.detailHeader}>
              <Syringe size={16} color="#E53935" />
              <Text style={styles.detailTitle}>Vaccini</Text>
            </View>
            {info.vaccines.map((vaccine, idx) => (
              <VaccineCard key={idx} vaccine={vaccine} />
            ))}
          </View>

          <View style={styles.detailSection}>
            <View style={styles.detailHeader}>
              <Pill size={16} color="#1565C0" />
              <Text style={styles.detailTitle}>Medicine da Portare</Text>
            </View>
            <View style={styles.medicineList}>
              {info.medicines.map((med, idx) => (
                <View key={idx} style={styles.medicinePill}>
                  <View style={styles.medicineDot} />
                  <Text style={styles.medicineText}>{med}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.emergencyBox} onPress={handleCallEmergency} activeOpacity={0.7}>
            <View style={styles.emergencyLeft}>
              <View style={styles.emergencyIconBox}>
                <Phone size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.emergencyLabel}>Emergenza Sanitaria</Text>
                <Text style={styles.emergencyNumber}>{info.emergencyNumber}</Text>
              </View>
            </View>
            <Text style={styles.emergencyCall}>Chiama</Text>
          </TouchableOpacity>

          {info.tips.length > 0 && (
            <View style={styles.detailSection}>
              <View style={styles.detailHeader}>
                <Info size={16} color="#FF9800" />
                <Text style={styles.detailTitle}>Consigli Utili</Text>
              </View>
              {info.tips.map((tip, idx) => (
                <View key={idx} style={styles.tipRow}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function VaccinesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return healthByCountry;
    return healthByCountry.filter((c) =>
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleToggle = useCallback((country: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedCountry((prev) => (prev === country ? null : country));
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#C62828', '#E53935', '#EF5350']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroIconRow}>
          <View style={styles.heroIconCircle}>
            <Heart size={28} color="#fff" fill="rgba(255,255,255,0.3)" />
          </View>
        </View>
        <Text style={styles.heroTitle}>Vaccini & Salute</Text>
        <Text style={styles.heroSub}>
          Informazioni sanitarie per destinazione: vaccini, medicine, numeri di emergenza
        </Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStatItem}>
            <Hospital size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroStatText}>{healthByCountry.length} destinazioni</Text>
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
          testID="search-country-input"
        />
      </View>

      <View style={styles.disclaimerBox}>
        <AlertTriangle size={16} color="#E65100" />
        <Text style={styles.disclaimerText}>
          Le informazioni sono indicative. Consulta sempre il tuo medico o un centro vaccinale prima di viaggiare.
        </Text>
      </View>

      <View style={styles.listSection}>
        {filteredCountries.map((info) => (
          <CountryHealthCard
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
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFF8E1',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB300',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#E65100',
    lineHeight: 17,
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
  },
  countryFlag: {
    fontSize: 32,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  countryVaccineCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  countryBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  detailSection: {
    marginTop: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  vaccineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },
  vaccineCardRequired: {
    borderLeftWidth: 3,
    borderLeftColor: '#E53935',
  },
  vaccineLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 10,
  },
  vaccineIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  vaccineName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  requiredBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#E53935',
  },
  vaccineNotes: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  medicineList: {
    gap: 6,
  },
  medicinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medicineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1565C0',
  },
  medicineText: {
    fontSize: 13,
    color: '#1565C0',
    fontWeight: '500' as const,
  },
  emergencyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEBEE',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emergencyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyLabel: {
    fontSize: 12,
    color: '#C62828',
    fontWeight: '500' as const,
  },
  emergencyNumber: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#C62828',
  },
  emergencyCall: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#E53935',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  tipBullet: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '700' as const,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
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
});
