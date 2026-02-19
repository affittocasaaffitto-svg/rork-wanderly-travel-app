import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_SETTINGS_KEY = 'wanderly_notif_settings';
const PUSH_TOKEN_KEY = 'wanderly_push_token';

export interface NotificationSettings {
  general: boolean;
  trips: boolean;
  destinations: boolean;
  offers: boolean;
  reviews: boolean;
}

export const DEFAULT_NOTIF_SETTINGS: NotificationSettings = {
  general: true,
  trips: true,
  destinations: false,
  offers: false,
  reviews: true,
};

export async function setupNotifications(): Promise<void> {
  console.log('[Notifications] Setting up notification handlers...');

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Generale',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1A936F',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('trips', {
      name: 'Viaggi',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });

    console.log('[Notifications] Android channels created');
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  console.log('[Notifications] Requesting permissions...');

  if (Platform.OS === 'web') {
    console.log('[Notifications] Web platform - skipping native permissions');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log('[Notifications] Existing permission status:', existingStatus);

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log('[Notifications] Requested permission, new status:', status);
  }

  if (finalStatus !== 'granted') {
    console.log('[Notifications] Permission not granted');
    return false;
  }

  console.log('[Notifications] Permission granted');
  return true;
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'vt7knnf9k1vayhfq6nj0m',
    });
    const token = tokenData.data;
    console.log('[Notifications] Push token:', token);

    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.log('[Notifications] Error getting push token:', error);
    return null;
  }
}

export async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const stored = await AsyncStorage.getItem(NOTIF_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as NotificationSettings;
      console.log('[Notifications] Loaded settings:', parsed);
      return parsed;
    }
  } catch (error) {
    console.log('[Notifications] Error loading settings:', error);
  }
  return DEFAULT_NOTIF_SETTINGS;
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(settings));
    console.log('[Notifications] Saved settings:', settings);
  } catch (error) {
    console.log('[Notifications] Error saving settings:', error);
  }
}

export async function scheduleTripReminder(
  tripId: string,
  tripName: string,
  destination: string,
  startDate: string,
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const settings = await loadNotificationSettings();
  if (!settings.trips) {
    console.log('[Notifications] Trip notifications disabled, skipping');
    return null;
  }

  const tripDate = new Date(startDate);
  const reminderDate = new Date(tripDate.getTime() - 24 * 60 * 60 * 1000);

  if (reminderDate <= new Date()) {
    console.log('[Notifications] Reminder date is in the past, skipping');
    return null;
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Viaggio domani!',
        body: `Il tuo viaggio "${tripName}" a ${destination} inizia domani! Sei pronto?`,
        data: { tripId, type: 'trip_reminder' },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
        channelId: 'trips',
      },
    });

    console.log('[Notifications] Scheduled trip reminder:', id);
    return id;
  } catch (error) {
    console.log('[Notifications] Error scheduling trip reminder:', error);
    return null;
  }
}

export async function scheduleTestNotification(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Wanderly - Test',
        body: 'Le notifiche funzionano correttamente!',
        data: { type: 'test' },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
        channelId: 'default',
      },
    });
    console.log('[Notifications] Test notification scheduled');
  } catch (error) {
    console.log('[Notifications] Error scheduling test notification:', error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Notifications] All notifications cancelled');
  } catch (error) {
    console.log('[Notifications] Error cancelling notifications:', error);
  }
}
