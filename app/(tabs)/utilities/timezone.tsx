import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Clock, Plus, X, Globe } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface CityTimezone {
  id: string;
  city: string;
  country: string;
  flag: string;
  utcOffset: number;
  abbreviation: string;
}

const ALL_CITIES: CityTimezone[] = [
  { id: 'rome', city: 'Roma', country: 'Italia', flag: '🇮🇹', utcOffset: 1, abbreviation: 'CET' },
  { id: 'london', city: 'Londra', country: 'UK', flag: '🇬🇧', utcOffset: 0, abbreviation: 'GMT' },
  { id: 'newyork', city: 'New York', country: 'USA', flag: '🇺🇸', utcOffset: -5, abbreviation: 'EST' },
  { id: 'losangeles', city: 'Los Angeles', country: 'USA', flag: '🇺🇸', utcOffset: -8, abbreviation: 'PST' },
  { id: 'tokyo', city: 'Tokyo', country: 'Giappone', flag: '🇯🇵', utcOffset: 9, abbreviation: 'JST' },
  { id: 'sydney', city: 'Sydney', country: 'Australia', flag: '🇦🇺', utcOffset: 11, abbreviation: 'AEDT' },
  { id: 'dubai', city: 'Dubai', country: 'EAU', flag: '🇦🇪', utcOffset: 4, abbreviation: 'GST' },
  { id: 'bangkok', city: 'Bangkok', country: 'Thailandia', flag: '🇹🇭', utcOffset: 7, abbreviation: 'ICT' },
  { id: 'paris', city: 'Parigi', country: 'Francia', flag: '🇫🇷', utcOffset: 1, abbreviation: 'CET' },
  { id: 'berlin', city: 'Berlino', country: 'Germania', flag: '🇩🇪', utcOffset: 1, abbreviation: 'CET' },
  { id: 'moscow', city: 'Mosca', country: 'Russia', flag: '🇷🇺', utcOffset: 3, abbreviation: 'MSK' },
  { id: 'mumbai', city: 'Mumbai', country: 'India', flag: '🇮🇳', utcOffset: 5.5, abbreviation: 'IST' },
  { id: 'beijing', city: 'Pechino', country: 'Cina', flag: '🇨🇳', utcOffset: 8, abbreviation: 'CST' },
  { id: 'cairo', city: 'Il Cairo', country: 'Egitto', flag: '🇪🇬', utcOffset: 2, abbreviation: 'EET' },
  { id: 'buenosaires', city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', utcOffset: -3, abbreviation: 'ART' },
  { id: 'saopaulo', city: 'San Paolo', country: 'Brasile', flag: '🇧🇷', utcOffset: -3, abbreviation: 'BRT' },
];

const DEFAULT_SELECTED = ['rome', 'newyork', 'tokyo', 'london'];

export default function TimezoneScreen() {
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_SELECTED);
  const [showPicker, setShowPicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedCities = useMemo(() => {
    return selectedIds.map(id => ALL_CITIES.find(c => c.id === id)!).filter(Boolean);
  }, [selectedIds]);

  const availableCities = useMemo(() => {
    return ALL_CITIES.filter(c => !selectedIds.includes(c.id));
  }, [selectedIds]);

  const getTimeForCity = useCallback((city: CityTimezone) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + city.utcOffset * 3600000);
    return cityTime;
  }, [currentTime]);

  const formatTime = useCallback((date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  }, []);

  const formatDate = useCallback((date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  }, []);

  const getDayStatus = useCallback((date: Date) => {
    const h = date.getHours();
    if (h >= 6 && h < 12) return { label: 'Mattina', color: '#FFB74D', emoji: '🌅' };
    if (h >= 12 && h < 18) return { label: 'Pomeriggio', color: '#4DD0E1', emoji: '☀️' };
    if (h >= 18 && h < 22) return { label: 'Sera', color: '#7B68EE', emoji: '🌆' };
    return { label: 'Notte', color: '#3D3D5C', emoji: '🌙' };
  }, []);

  const addCity = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIds(prev => [...prev, id]);
    setShowPicker(false);
  }, []);

  const removeCity = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIds(prev => prev.filter(cid => cid !== id));
  }, []);

  const homeCity = selectedCities[0];
  const homeTime = homeCity ? getTimeForCity(homeCity) : currentTime;
  const homeFormatted = formatTime(homeTime);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {homeCity && (
        <LinearGradient
          colors={['#1A1A2E', '#2D2D5E', '#4A4A8A']}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <Text style={styles.heroFlag}>{homeCity.flag}</Text>
            <View>
              <Text style={styles.heroCity}>{homeCity.city}</Text>
              <Text style={styles.heroCountry}>{homeCity.country} · {homeCity.abbreviation}</Text>
            </View>
          </View>
          <View style={styles.heroTimeRow}>
            <Text style={styles.heroTime}>{homeFormatted.hours}</Text>
            <Text style={styles.heroTimeSep}>:</Text>
            <Text style={styles.heroTime}>{homeFormatted.minutes}</Text>
            <Text style={styles.heroSeconds}>{homeFormatted.seconds}</Text>
          </View>
          <Text style={styles.heroDate}>{formatDate(homeTime)}</Text>
        </LinearGradient>
      )}

      <Text style={styles.sectionTitle}>Orologi Mondiali</Text>

      {selectedCities.map((city, index) => {
        const cityTime = getTimeForCity(city);
        const formatted = formatTime(cityTime);
        const status = getDayStatus(cityTime);
        const diffHours = city.utcOffset - (homeCity?.utcOffset ?? 0);
        const diffLabel = diffHours >= 0 ? `+${diffHours}h` : `${diffHours}h`;

        return (
          <View key={city.id} style={styles.clockCard}>
            <View style={[styles.clockIndicator, { backgroundColor: status.color }]} />
            <View style={styles.clockLeft}>
              <View style={styles.clockCityRow}>
                <Text style={styles.clockFlag}>{city.flag}</Text>
                <View>
                  <Text style={styles.clockCity}>{city.city}</Text>
                  <Text style={styles.clockMeta}>
                    {status.emoji} {status.label} · {city.abbreviation}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.clockRight}>
              <Text style={styles.clockTime}>
                {formatted.hours}:{formatted.minutes}
              </Text>
              <Text style={styles.clockDiff}>
                {index === 0 ? 'Casa' : diffLabel}
              </Text>
            </View>
            {index > 0 && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeCity(city.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X color={Colors.textLight} size={14} />
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      {!showPicker ? (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowPicker(true);
          }}
        >
          <Plus color={Colors.teal} size={20} />
          <Text style={styles.addBtnText}>Aggiungi Città</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.pickerCard}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Seleziona Città</Text>
            <TouchableOpacity onPress={() => setShowPicker(false)}>
              <X color={Colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
          {availableCities.map((city) => (
            <TouchableOpacity
              key={city.id}
              style={styles.pickerItem}
              onPress={() => addCity(city.id)}
            >
              <Text style={styles.pickerFlag}>{city.flag}</Text>
              <View style={styles.pickerInfo}>
                <Text style={styles.pickerCity}>{city.city}</Text>
                <Text style={styles.pickerCountry}>{city.country}</Text>
              </View>
              <Text style={styles.pickerOffset}>UTC{city.utcOffset >= 0 ? '+' : ''}{city.utcOffset}</Text>
            </TouchableOpacity>
          ))}
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
    padding: 16,
  },
  heroCard: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  heroFlag: {
    fontSize: 28,
  },
  heroCity: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  heroCountry: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  heroTimeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroTime: {
    fontSize: 56,
    fontWeight: '800' as const,
    color: Colors.white,
    letterSpacing: 2,
  },
  heroTimeSep: {
    fontSize: 48,
    fontWeight: '300' as const,
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  heroSeconds: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.4)',
    marginLeft: 6,
  },
  heroDate: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 14,
  },
  clockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  clockIndicator: {
    width: 4,
    height: 44,
    borderRadius: 2,
    marginRight: 14,
  },
  clockLeft: {
    flex: 1,
  },
  clockCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clockFlag: {
    fontSize: 22,
  },
  clockCity: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  clockMeta: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  clockRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  clockTime: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  clockDiff: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.teal,
    marginTop: 2,
  },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.teal,
  },
  pickerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  pickerFlag: {
    fontSize: 22,
  },
  pickerInfo: {
    flex: 1,
  },
  pickerCity: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  pickerCountry: {
    fontSize: 12,
    color: Colors.textLight,
  },
  pickerOffset: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.purple,
  },
});
