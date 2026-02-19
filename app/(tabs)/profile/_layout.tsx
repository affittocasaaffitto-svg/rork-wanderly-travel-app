import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: "700" as const },
        headerBackTitle: "Indietro",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: true, title: "Modifica Profilo" }} />
      <Stack.Screen name="language" options={{ headerShown: true, title: "Lingua" }} />
      <Stack.Screen name="notifications" options={{ headerShown: true, title: "Notifiche" }} />
      <Stack.Screen name="theme" options={{ headerShown: true, title: "Tema" }} />
      <Stack.Screen name="terms" options={{ headerShown: true, title: "Termini di Servizio" }} />
      <Stack.Screen name="privacy" options={{ headerShown: true, title: "Privacy Policy" }} />
      <Stack.Screen name="info" options={{ headerShown: true, title: "Informazioni" }} />
      <Stack.Screen name="help" options={{ headerShown: true, title: "Centro Assistenza" }} />
    </Stack>
  );
}
