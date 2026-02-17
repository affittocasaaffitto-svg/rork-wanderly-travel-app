import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="language" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="theme" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="info" />
      <Stack.Screen name="help" />
    </Stack>
  );
}
