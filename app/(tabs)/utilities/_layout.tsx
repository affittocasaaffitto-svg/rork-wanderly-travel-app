import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function UtilitiesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: "700" as const },
        headerBackTitle: "Indietro",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="checklist" options={{ title: "Checklist Valigia" }} />
      <Stack.Screen name="phrasebook" options={{ title: "Frasario Viaggio" }} />
      <Stack.Screen name="converter" options={{ title: "Convertitore Valuta" }} />
      <Stack.Screen name="weather" options={{ title: "Meteo e Clima" }} />
      <Stack.Screen name="emergency" options={{ title: "SOS Emergenza" }} />
      <Stack.Screen name="tips" options={{ title: "Calcolatore Mancia" }} />
      <Stack.Screen name="timezone" options={{ title: "Fusi Orari" }} />
      <Stack.Screen name="budget" options={{ title: "Budget Viaggio" }} />
      <Stack.Screen name="units" options={{ title: "Convertitore Unità" }} />
      <Stack.Screen name="wifi" options={{ title: "Password WiFi" }} />
      <Stack.Screen name="flights" options={{ title: "Stato Voli" }} />
      <Stack.Screen name="translator" options={{ title: "Traduttore Live" }} />
      <Stack.Screen name="scan" options={{ title: "Scansiona Documenti" }} />
      <Stack.Screen name="offline-maps" options={{ title: "Mappe Offline" }} />
      <Stack.Screen name="vaccines" options={{ title: "Vaccini & Salute" }} />
      <Stack.Screen name="menu-translator" options={{ title: "Traduttore Menu" }} />
      <Stack.Screen name="power-adapters" options={{ title: "Adattatori & Tensione" }} />
    </Stack>
  );
}
