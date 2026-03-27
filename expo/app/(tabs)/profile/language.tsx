import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface LangOption {
  code: string;
  label: string;
  flag: string;
}

const languages: LangOption[] = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('it');

  const handleSelect = (code: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(code);
    Alert.alert('Lingua', 'Lingua aggiornata con successo!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>

      <View style={styles.card}>
        {languages.map((lang, index) => (
          <React.Fragment key={lang.code}>
            <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => handleSelect(lang.code)}>
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={styles.label}>{lang.label}</Text>
              {selected === lang.code && <Check color={Colors.tealDark} size={20} />}
            </TouchableOpacity>
            {index < languages.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  flag: {
    fontSize: 24,
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.background,
    marginLeft: 54,
  },
});
