import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Sun, Cloud, CloudRain, Droplets, Wind, Thermometer, Sunrise, Sunset } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { weatherCities } from '@/constants/weather';

const conditionIcons: Record<string, React.ComponentType<{ color: string; size: number }>> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
};

export default function WeatherScreen() {
  const [selectedCity, setSelectedCity] = useState(0);
  const city = weatherCities[selectedCity];

  const handleCityChange = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCity(index);
  }, []);

  const WeatherIcon = conditionIcons[city.forecast[0]?.condition || 'sunny'] || Sun;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityRow}>
        {weatherCities.map((c, i) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.cityPill, selectedCity === i && styles.cityPillActive]}
            onPress={() => handleCityChange(i)}
          >
            <Text style={[styles.cityPillText, selectedCity === i && styles.cityPillTextActive]}>
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.heroWrapper}>
        <LinearGradient
          colors={['#4DD0E1', '#5C8AE6', '#7B68EE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroCity}>{city.name}, {city.country}</Text>
          <View style={styles.heroMain}>
            <WeatherIcon color={Colors.white} size={48} />
            <Text style={styles.heroTemp}>{city.temp}°C</Text>
          </View>
          <Text style={styles.heroCondition}>{city.condition}</Text>
          <Text style={styles.heroDetail}>
            Percepita {city.feelsLike}°C · Max {city.high}°C · Min {city.low}°C
          </Text>
        </LinearGradient>
      </View>

      <Text style={styles.sectionTitle}>Previsioni 7 Giorni</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastRow}>
        {city.forecast.map((day, i) => {
          const DayIcon = conditionIcons[day.condition] || Sun;
          return (
            <View key={i} style={styles.forecastCard}>
              <Text style={styles.forecastDay}>{day.day}</Text>
              <DayIcon color={Colors.teal} size={24} />
              <View style={styles.forecastTempBubble}>
                <Text style={styles.forecastTemp}>{day.temp}°</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>Statistiche Dettagliate</Text>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderLeftColor: Colors.teal }]}>
          <Droplets color={Colors.teal} size={22} />
          <Text style={styles.statValue}>{city.humidity}%</Text>
          <Text style={styles.statLabel}>Umidità</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: Colors.purple }]}>
          <Wind color={Colors.purple} size={22} />
          <Text style={styles.statValue}>{city.wind} km/h</Text>
          <Text style={styles.statLabel}>Vento {city.windDir}</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: Colors.coral }]}>
          <Sun color={Colors.coral} size={22} />
          <Text style={styles.statValue}>{city.uvIndex}</Text>
          <Text style={styles.statLabel}>Indice UV</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: Colors.teal }]}>
          <View style={styles.sunTimes}>
            <View style={styles.sunRow}>
              <Sunrise color={Colors.teal} size={16} />
              <Text style={styles.sunText}>{city.sunrise}</Text>
            </View>
            <View style={styles.sunRow}>
              <Sunset color={Colors.coral} size={16} />
              <Text style={styles.sunText}>{city.sunset}</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Alba / Tramonto</Text>
        </View>
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
  cityRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 56,
  },
  cityPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  cityPillActive: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  cityPillText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  cityPillTextActive: {
    color: Colors.white,
  },
  heroWrapper: {
    paddingHorizontal: 16,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  heroCity: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  heroTemp: {
    fontSize: 56,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  heroCondition: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  heroDetail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  forecastRow: {
    paddingHorizontal: 16,
  },
  forecastCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginRight: 10,
    minWidth: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  forecastDay: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  forecastTempBubble: {
    backgroundColor: Colors.tealLight,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.tealDark,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sunTimes: {
    gap: 6,
  },
  sunRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sunText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
});
