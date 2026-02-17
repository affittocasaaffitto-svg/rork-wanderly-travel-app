import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Plane, MapPin, Tag, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface NotifSetting {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  color: string;
}

const notifSettings: NotifSetting[] = [
  { key: 'general', label: 'Notifiche Generali', description: 'Aggiornamenti e novità dell\'app', icon: Bell, color: Colors.tealDark },
  { key: 'trips', label: 'Promemoria Viaggi', description: 'Reminder per i tuoi viaggi pianificati', icon: Plane, color: Colors.purpleDark },
  { key: 'destinations', label: 'Nuove Destinazioni', description: 'Suggerimenti su nuove mete', icon: MapPin, color: Colors.coral },
  { key: 'offers', label: 'Offerte e Promozioni', description: 'Sconti e offerte speciali', icon: Tag, color: Colors.success },
  { key: 'reviews', label: 'Recensioni e Valutazioni', description: 'Ricordati di valutare i tuoi viaggi', icon: Star, color: Colors.warning },
];

export default function NotificationsScreen() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    general: true,
    trips: true,
    destinations: false,
    offers: false,
    reviews: true,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Notifiche', headerShown: true, headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.textPrimary }} />
      <Text style={styles.hint}>Gestisci le notifiche che desideri ricevere</Text>
      <View style={styles.card}>
        {notifSettings.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.key}>
              <View style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: item.color + '20' }]}>
                  <Icon color={item.color} size={20} />
                </View>
                <View style={styles.textWrap}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.desc}>{item.description}</Text>
                </View>
                <Switch
                  value={settings[item.key]}
                  onValueChange={() => toggleSetting(item.key)}
                  trackColor={{ false: Colors.border, true: Colors.teal }}
                  thumbColor={Platform.OS === 'android' ? Colors.white : undefined}
                />
              </View>
              {index < notifSettings.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  hint: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  desc: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.background,
    marginLeft: 68,
  },
});
