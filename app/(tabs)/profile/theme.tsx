import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Sun, Moon, Smartphone, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ThemeOption {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  color: string;
  bg: string;
}

const themes: ThemeOption[] = [
  { key: 'light', label: 'Chiaro', description: 'Tema sempre chiaro', icon: Sun, color: '#F59E0B', bg: '#FEF3C7' },
  { key: 'dark', label: 'Scuro', description: 'Tema sempre scuro', icon: Moon, color: '#6366F1', bg: '#E0E7FF' },
  { key: 'auto', label: 'Automatico', description: 'Segue le impostazioni di sistema', icon: Smartphone, color: Colors.tealDark, bg: Colors.tealLight },
];

export default function ThemeScreen() {
  const [selected, setSelected] = useState<string>('auto');

  const handleSelect = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(key);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Tema', headerShown: true, headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.textPrimary }} />
      <Text style={styles.hint}>Scegli l'aspetto dell'app</Text>
      <View style={styles.options}>
        {themes.map((t) => {
          const Icon = t.icon;
          const isSelected = selected === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              activeOpacity={0.8}
              onPress={() => handleSelect(t.key)}
            >
              <View style={[styles.iconCircle, { backgroundColor: t.bg }]}>
                <Icon color={t.color} size={28} />
              </View>
              <Text style={styles.optionLabel}>{t.label}</Text>
              <Text style={styles.optionDesc}>{t.description}</Text>
              {isSelected && (
                <View style={styles.checkCircle}>
                  <Check color={Colors.white} size={14} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  hint: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 16,
  },
  options: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: Colors.tealDark,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: Colors.textLight,
  },
  checkCircle: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
