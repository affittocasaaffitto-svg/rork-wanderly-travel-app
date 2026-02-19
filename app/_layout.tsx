import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppStateProvider } from "../hooks/useAppState";

try {
  SplashScreen.preventAutoHideAsync();
} catch (e) {
  console.log('[Layout] SplashScreen.preventAutoHideAsync error:', e);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Indietro" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function AppErrorFallback({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <View style={fallbackStyles.container}>
      <Text style={fallbackStyles.emoji}>⚠️</Text>
      <Text style={fallbackStyles.title}>Qualcosa è andato storto</Text>
      <Text style={fallbackStyles.message}>{error?.message ?? 'Errore sconosciuto'}</Text>
      <TouchableOpacity style={fallbackStyles.button} onPress={onRetry}>
        <Text style={fallbackStyles.buttonText}>Riprova</Text>
      </TouchableOpacity>
    </View>
  );
}

const fallbackStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F7FA', padding: 32 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700' as const, color: '#1A1A2E', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  button: { backgroundColor: '#4DD0E1', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 50 },
  buttonText: { fontSize: 16, fontWeight: '700' as const, color: '#FFFFFF' },
});

export default function RootLayout() {
  const [appError, setAppError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('[Layout] RootLayout mounted');
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
      console.log('[Layout] SplashScreen hidden');
    }, 100);

    if (Platform.OS !== 'web') {
      initNotifications();
    }

    return () => clearTimeout(timer);
  }, []);

  if (appError) {
    return <AppErrorFallback error={appError} onRetry={() => setAppError(null)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppStateProvider>
          <RootLayoutNav />
        </AppStateProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

async function initNotifications() {
  try {
    const Notifications = await import('expo-notifications');
    const { setupNotifications, registerForPushNotifications } = await import('@/services/notifications');

    await setupNotifications();
    console.log('[Layout] Notification setup complete');

    const token = await registerForPushNotifications();
    console.log('[Layout] Push token result:', token ? 'obtained' : 'not available');

    Notifications.addNotificationReceivedListener(notification => {
      console.log('[Layout] Notification received:', notification.request.content.title);
    });

    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('[Layout] Notification tapped:', response.notification.request.content.data);
    });
  } catch (e) {
    console.log('[Layout] Notification init error:', e);
  }
}
