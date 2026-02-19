import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppStateProvider } from "../hooks/useAppState";
import ErrorBoundary from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('[Layout] SplashScreen.preventAutoHideAsync failed');
});

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
  useEffect(() => {
    console.log('[Layout] RootLayout mounted, hiding splash...');
    SplashScreen.hideAsync().catch(() => {});

    if (Platform.OS !== 'web') {
      initNotifications();
    }
  }, []);

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
