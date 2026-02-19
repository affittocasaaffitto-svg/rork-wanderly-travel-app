import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from 'expo-notifications';
import { AppStateProvider } from "../hooks/useAppState";
import { setupNotifications, registerForPushNotifications } from "@/services/notifications";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
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

export default function RootLayout() {
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    if (Platform.OS !== 'web') {
      try {
        setupNotifications().then(() => {
          console.log('[Layout] Notification setup complete');
          registerForPushNotifications().then((token) => {
            console.log('[Layout] Push token result:', token ? 'obtained' : 'not available');
          }).catch(e => console.log('[Layout] Push token error:', e));
        }).catch(e => console.log('[Layout] Notification setup error:', e));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          console.log('[Layout] Notification received:', notification.request.content.title);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('[Layout] Notification tapped:', response.notification.request.content.data);
        });
      } catch (e) {
        console.log('[Layout] Notification init error:', e);
      }
    }

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

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
