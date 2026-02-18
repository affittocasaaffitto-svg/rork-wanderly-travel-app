import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, Platform, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Plane, MapPin, Tag, Star, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  NotificationSettings,
  DEFAULT_NOTIF_SETTINGS,
  loadNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermissions,
  scheduleTestNotification,
} from '@/services/notifications';

interface NotifSetting {
  key: keyof NotificationSettings;
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
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIF_SETTINGS);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    loadNotificationSettings().then((loaded) => {
      setSettings(loaded);
      console.log('[NotificationsScreen] Loaded settings:', loaded);
    });

    if (Platform.OS !== 'web') {
      const checkPermissions = async () => {
        const Notifications = await import('expo-notifications');
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionGranted(status === 'granted');
        console.log('[NotificationsScreen] Permission status:', status);
      };
      checkPermissions();
    }
  }, []);

  const toggleSetting = useCallback(async (key: keyof NotificationSettings) => {
    if (!permissionGranted && Platform.OS !== 'web') {
      const granted = await requestNotificationPermissions();
      setPermissionGranted(granted);
      if (!granted) {
        Alert.alert(
          'Permessi necessari',
          'Per ricevere notifiche, abilita i permessi nelle impostazioni del dispositivo.',
        );
        return;
      }
    }

    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      saveNotificationSettings(updated);
      console.log('[NotificationsScreen] Updated setting:', key, '=', updated[key]);
      return updated;
    });
  }, [permissionGranted]);

  const handleTestNotification = useCallback(async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Info', 'Le notifiche di test funzionano solo su dispositivo fisico.');
      return;
    }

    if (!permissionGranted) {
      const granted = await requestNotificationPermissions();
      setPermissionGranted(granted);
      if (!granted) {
        Alert.alert(
          'Permessi necessari',
          'Per ricevere notifiche, abilita i permessi nelle impostazioni del dispositivo.',
        );
        return;
      }
    }

    await scheduleTestNotification();
    Alert.alert('Notifica inviata', 'Riceverai una notifica di test tra pochi secondi.');
  }, [permissionGranted]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Notifiche', headerShown: true, headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.textPrimary }} />

      {permissionGranted === false && Platform.OS !== 'web' && (
        <TouchableOpacity
          style={styles.permissionBanner}
          onPress={async () => {
            const granted = await requestNotificationPermissions();
            setPermissionGranted(granted);
          }}
          activeOpacity={0.7}
        >
          <Bell color="#D97706" size={18} />
          <Text style={styles.permissionText}>
            Notifiche disattivate. Tocca per abilitare i permessi.
          </Text>
        </TouchableOpacity>
      )}

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

      <TouchableOpacity
        style={styles.testButton}
        onPress={handleTestNotification}
        activeOpacity={0.7}
      >
        <Send color={Colors.white} size={18} />
        <Text style={styles.testButtonText}>Invia notifica di test</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Le notifiche push richiedono i permessi del dispositivo. Le preferenze vengono salvate localmente.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F59E0B30',
  },
  permissionText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500' as const,
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
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tealDark,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 20,
    gap: 8,
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  footer: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});
