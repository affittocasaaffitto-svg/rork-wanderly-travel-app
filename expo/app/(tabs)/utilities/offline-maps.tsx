import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  MapPin,
  Download,
  Search,
  Trash2,
  CheckCircle,
  Map,
  Navigation,
  Wifi,
  WifiOff,
  HardDrive,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface OfflineMap {
  id: string;
  city: string;
  country: string;
  flag: string;
  sizeMB: number;
  downloadedAt: string;
  status: 'downloaded' | 'downloading';
  progress: number;
}

interface SuggestedCity {
  city: string;
  country: string;
  flag: string;
  sizeMB: number;
}

const SUGGESTED_CITIES: SuggestedCity[] = [
  { city: 'Roma', country: 'Italia', flag: '🇮🇹', sizeMB: 145 },
  { city: 'Parigi', country: 'Francia', flag: '🇫🇷', sizeMB: 189 },
  { city: 'Barcellona', country: 'Spagna', flag: '🇪🇸', sizeMB: 134 },
  { city: 'Londra', country: 'Regno Unito', flag: '🇬🇧', sizeMB: 210 },
  { city: 'Tokyo', country: 'Giappone', flag: '🇯🇵', sizeMB: 256 },
  { city: 'New York', country: 'USA', flag: '🇺🇸', sizeMB: 278 },
  { city: 'Amsterdam', country: 'Paesi Bassi', flag: '🇳🇱', sizeMB: 98 },
  { city: 'Lisbona', country: 'Portogallo', flag: '🇵🇹', sizeMB: 112 },
  { city: 'Bangkok', country: 'Thailandia', flag: '🇹🇭', sizeMB: 167 },
  { city: 'Dubai', country: 'Emirati Arabi', flag: '🇦🇪', sizeMB: 143 },
  { city: 'Berlino', country: 'Germania', flag: '🇩🇪', sizeMB: 156 },
  { city: 'Praga', country: 'Rep. Ceca', flag: '🇨🇿', sizeMB: 87 },
];

function DownloadedMapCard({ map, onDelete }: { map: OfflineMap; onDelete: () => void }) {
  const progressAnim = useRef(new Animated.Value(map.progress)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: map.progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [map.progress]);

  return (
    <View style={styles.downloadedCard}>
      <View style={styles.downloadedLeft}>
        <View style={[styles.mapIconBox, { backgroundColor: map.status === 'downloaded' ? '#E8F5E9' : '#FFF3E0' }]}>
          {map.status === 'downloaded' ? (
            <CheckCircle size={20} color="#4CAF50" />
          ) : (
            <Download size={20} color="#FF9800" />
          )}
        </View>
        <View style={styles.downloadedInfo}>
          <Text style={styles.downloadedCity}>{map.flag} {map.city}</Text>
          <Text style={styles.downloadedMeta}>
            {map.status === 'downloaded'
              ? `${map.sizeMB} MB • ${map.downloadedAt}`
              : `Download in corso... ${Math.round(map.progress * 100)}%`}
          </Text>
          {map.status === 'downloading' && (
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          )}
        </View>
      </View>
      {map.status === 'downloaded' && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} testID={`delete-map-${map.id}`}>
          <Trash2 size={18} color="#EF5350" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function OfflineMapsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedMaps, setDownloadedMaps] = useState<OfflineMap[]>([]);

  const filteredCities = SUGGESTED_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSizeMB = downloadedMaps
    .filter((m) => m.status === 'downloaded')
    .reduce((acc, m) => acc + m.sizeMB, 0);

  const handleDownload = useCallback((city: SuggestedCity) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const alreadyExists = downloadedMaps.find((m) => m.city === city.city);
    if (alreadyExists) {
      Alert.alert('Mappa già scaricata', `La mappa di ${city.city} è già disponibile offline.`);
      return;
    }

    const newMap: OfflineMap = {
      id: Date.now().toString(),
      city: city.city,
      country: city.country,
      flag: city.flag,
      sizeMB: city.sizeMB,
      downloadedAt: '',
      status: 'downloading',
      progress: 0,
    };

    setDownloadedMaps((prev) => [newMap, ...prev]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.08 + Math.random() * 0.12;
      if (progress >= 1) {
        progress = 1;
        clearInterval(interval);
        setDownloadedMaps((prev) =>
          prev.map((m) =>
            m.id === newMap.id
              ? { ...m, status: 'downloaded' as const, progress: 1, downloadedAt: new Date().toLocaleDateString('it-IT') }
              : m
          )
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setDownloadedMaps((prev) =>
          prev.map((m) => (m.id === newMap.id ? { ...m, progress } : m))
        );
      }
    }, 200);

    console.log(`[OfflineMaps] Downloading map for ${city.city}`);
  }, [downloadedMaps]);

  const handleDelete = useCallback((mapId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Elimina Mappa',
      'Vuoi eliminare questa mappa offline?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: () => {
            setDownloadedMaps((prev) => prev.filter((m) => m.id !== mapId));
            console.log(`[OfflineMaps] Deleted map ${mapId}`);
          },
        },
      ]
    );
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#43A047']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroIconRow}>
          <View style={styles.heroIconCircle}>
            <Map size={28} color="#fff" />
          </View>
          <View style={styles.heroWifiIcon}>
            <WifiOff size={16} color="rgba(255,255,255,0.7)" />
          </View>
        </View>
        <Text style={styles.heroTitle}>Mappe Offline</Text>
        <Text style={styles.heroSub}>Scarica le mappe prima di partire e naviga senza connessione internet</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStatItem}>
            <HardDrive size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroStatText}>{totalSizeMB > 0 ? `${totalSizeMB} MB` : '0 MB'} usati</Text>
          </View>
          <View style={styles.heroStatItem}>
            <Navigation size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroStatText}>{downloadedMaps.filter((m) => m.status === 'downloaded').length} mappe</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Search size={18} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca destinazione..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="search-city-input"
        />
      </View>

      {downloadedMaps.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mappe Scaricate</Text>
          {downloadedMaps.map((map) => (
            <DownloadedMapCard key={map.id} map={map} onDelete={() => handleDelete(map.id)} />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destinazioni Popolari</Text>
        <Text style={styles.sectionSub}>Tocca per scaricare la mappa offline</Text>
        {filteredCities.map((city, index) => {
          const isDownloaded = downloadedMaps.some((m) => m.city === city.city);
          return (
            <TouchableOpacity
              key={`${city.city}-${index}`}
              style={styles.cityRow}
              onPress={() => handleDownload(city)}
              activeOpacity={0.7}
              testID={`city-${city.city}`}
            >
              <View style={styles.cityLeft}>
                <Text style={styles.cityFlag}>{city.flag}</Text>
                <View>
                  <Text style={styles.cityName}>{city.city}</Text>
                  <Text style={styles.cityCountry}>{city.country} • {city.sizeMB} MB</Text>
                </View>
              </View>
              {isDownloaded ? (
                <CheckCircle size={20} color="#4CAF50" />
              ) : (
                <View style={styles.downloadIcon}>
                  <Download size={18} color="#2E7D32" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.tipCard}>
        <Wifi size={18} color="#1565C0" />
        <Text style={styles.tipText}>
          Consiglio: scarica le mappe quando sei connesso al WiFi per risparmiare dati mobili.
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
  heroWifiIcon: {
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
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  downloadedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  downloadedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  mapIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadedInfo: {
    flex: 1,
  },
  downloadedCity: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  downloadedMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  cityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cityFlag: {
    fontSize: 28,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  cityCountry: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  downloadIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 14,
    padding: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
});
