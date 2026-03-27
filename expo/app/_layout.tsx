import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppStateProvider } from "../hooks/useAppState";
import ErrorBoundary from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync().catch(() => {});

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
    console.log('[Layout] RootLayout mounted');
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
    const { setupNotifications, registerForPushNotifications } = await import('@/services/notifications');
    await setupNotifications();
    console.log('[Layout] Notification setup complete');
    await registerForPushNotifications();
  } catch (e) {
    console.log('[Layout] Notification init error (non-critical):', e);
  }
}
