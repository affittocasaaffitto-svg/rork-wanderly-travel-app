import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Platform, View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppStateProvider } from "../hooks/useAppState";
import ErrorBoundary from "@/components/ErrorBoundary";

try {
  SplashScreen.preventAutoHideAsync();
} catch (e) {
  console.log('[Layout] preventAutoHideAsync error:', e);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Indietro" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    console.log('[Layout] RootLayout mounted');

    const prepare = async () => {
      try {
        if (Platform.OS !== 'web') {
          await initNotifications();
        }
      } catch (e) {
        console.log('[Layout] Prepare error (non-critical):', e);
      } finally {
        setAppReady(true);
        try {
          await SplashScreen.hideAsync();
          console.log('[Layout] Splash hidden');
        } catch (e) {
          console.log('[Layout] hideAsync error:', e);
        }
      }
    };

    prepare();
  }, []);

  if (!appReady) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color="#4DD0E1" />
        <Text style={loadingStyles.text}>Caricamento...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppStateProvider>
            <RootLayoutNav />
          </AppStateProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
});

async function initNotifications() {
  try {
    const Notifications = await import('expo-notifications');
    const { setupNotifications, registerForPushNotifications } = await import('@/services/notifications');

    await setupNotifications();
    console.log('[Layout] Notification setup complete');

    const token = await registerForPushNotifications();
    console.log('[Layout] Push token:', token ? 'obtained' : 'not available');

    Notifications.addNotificationReceivedListener(notification => {
      console.log('[Layout] Notification received:', notification.request.content.title);
    });

    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('[Layout] Notification tapped:', response.notification.request.content.data);
    });
  } catch (e) {
    console.log('[Layout] Notification init error (non-critical):', e);
  }
}
