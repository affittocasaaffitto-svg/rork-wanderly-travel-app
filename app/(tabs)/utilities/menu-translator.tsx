import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  Languages,
  ImageIcon,
  AlertTriangle,
  Wheat,
  Milk,
  Nut,
  Fish,
  Egg,
  Bean,
  ChevronDown,
  X,
  Sparkles,
  ScanLine,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface TranslatedDish {
  original: string;
  translated: string;
  allergens: string[];
}

interface AllergenInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const ALLERGENS: AllergenInfo[] = [
  { id: 'gluten', name: 'Glutine', icon: '🌾', color: '#E65100' },
  { id: 'dairy', name: 'Lattosio', icon: '🥛', color: '#1565C0' },
  { id: 'nuts', name: 'Frutta secca', icon: '🥜', color: '#795548' },
  { id: 'fish', name: 'Pesce', icon: '🐟', color: '#00838F' },
  { id: 'eggs', name: 'Uova', icon: '🥚', color: '#F9A825' },
  { id: 'soy', name: 'Soia', icon: '🫘', color: '#33691E' },
  { id: 'shellfish', name: 'Crostacei', icon: '🦐', color: '#D32F2F' },
  { id: 'celery', name: 'Sedano', icon: '🥬', color: '#2E7D32' },
];

const SAMPLE_RESULTS: TranslatedDish[] = [
  { original: 'Pad Thai Kung', translated: 'Pad Thai con gamberi', allergens: ['shellfish', 'nuts', 'soy', 'eggs'] },
  { original: 'Tom Yum Goong', translated: 'Zuppa piccante di gamberi', allergens: ['shellfish', 'fish'] },
  { original: 'Som Tam', translated: 'Insalata di papaya verde', allergens: ['nuts', 'fish'] },
  { original: 'Khao Pad', translated: 'Riso fritto', allergens: ['soy', 'eggs'] },
  { original: 'Gaeng Keow Wan', translated: 'Curry verde', allergens: ['dairy', 'fish'] },
  { original: 'Massaman Curry', translated: 'Curry Massaman con manzo', allergens: ['nuts', 'dairy'] },
];

const LANGUAGES = [
  { code: 'th', name: 'Tailandese', flag: '🇹🇭' },
  { code: 'ja', name: 'Giapponese', flag: '🇯🇵' },
  { code: 'zh', name: 'Cinese', flag: '🇨🇳' },
  { code: 'ko', name: 'Coreano', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabo', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'vi', name: 'Vietnamita', flag: '🇻🇳' },
  { code: 'el', name: 'Greco', flag: '🇬🇷' },
  { code: 'tr', name: 'Turco', flag: '🇹🇷' },
  { code: 'ru', name: 'Russo', flag: '🇷🇺' },
];

function DishCard({ dish }: { dish: TranslatedDish }) {
  const dishAllergens = ALLERGENS.filter((a) => dish.allergens.includes(a.id));

  return (
    <View style={styles.dishCard}>
      <View style={styles.dishTop}>
        <View style={styles.dishTexts}>
          <Text style={styles.dishOriginal}>{dish.original}</Text>
          <Text style={styles.dishTranslated}>{dish.translated}</Text>
        </View>
      </View>
      {dishAllergens.length > 0 && (
        <View style={styles.allergenRow}>
          {dishAllergens.map((allergen) => (
            <View key={allergen.id} style={[styles.allergenPill, { backgroundColor: allergen.color + '15' }]}>
              <Text style={styles.allergenIcon}>{allergen.icon}</Text>
              <Text style={[styles.allergenName, { color: allergen.color }]}>{allergen.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function MenuTranslatorScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<TranslatedDish[]>([]);
  const [selectedLang, setSelectedLang] = useState(0);
  const [showLanguages, setShowLanguages] = useState(false);
  const [manualText, setManualText] = useState('');

  const handlePickImage = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permesso necessario', 'Serve accesso alla galleria per selezionare la foto del menu.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        simulateProcessing();
      }
    } catch (error) {
      console.log('[MenuTranslator] Image picker error:', error);
    }
  }, []);

  const handleTakePhoto = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permesso necessario', 'Serve accesso alla fotocamera per scattare foto del menu.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        simulateProcessing();
      }
    } catch (error) {
      console.log('[MenuTranslator] Camera error:', error);
    }
  }, []);

  const simulateProcessing = useCallback(() => {
    setIsProcessing(true);
    setResults([]);
    console.log('[MenuTranslator] Processing image...');
    setTimeout(() => {
      const shuffled = [...SAMPLE_RESULTS].sort(() => Math.random() - 0.5);
      setResults(shuffled.slice(0, 4 + Math.floor(Math.random() * 3)));
      setIsProcessing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('[MenuTranslator] Processing complete');
    }, 2500);
  }, []);

  const handleManualTranslate = useCallback(() => {
    if (!manualText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsProcessing(true);
    setResults([]);
    setTimeout(() => {
      const lines = manualText.split('\n').filter((l) => l.trim());
      const translated: TranslatedDish[] = lines.map((line) => ({
        original: line.trim(),
        translated: `[Traduzione di "${line.trim()}"]`,
        allergens: ALLERGENS.slice(0, Math.floor(Math.random() * 3))
          .map((a) => a.id),
      }));
      setResults(translated.length > 0 ? translated : SAMPLE_RESULTS.slice(0, 3));
      setIsProcessing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1800);
  }, [manualText]);

  const handleClear = useCallback(() => {
    setSelectedImage(null);
    setResults([]);
    setManualText('');
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#4A148C', '#6A1B9A', '#8E24AA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroIconRow}>
          <View style={styles.heroIconCircle}>
            <Languages size={28} color="#fff" />
          </View>
          <View style={styles.heroSparkle}>
            <Sparkles size={16} color="rgba(255,255,255,0.7)" />
          </View>
        </View>
        <Text style={styles.heroTitle}>Traduttore Menu</Text>
        <Text style={styles.heroSub}>
          Scatta una foto del menu o inserisci il testo per tradurre i piatti e identificare gli allergeni
        </Text>
      </LinearGradient>

      <View style={styles.langSelector}>
        <Text style={styles.langLabel}>Lingua del menu:</Text>
        <TouchableOpacity
          style={styles.langDropdown}
          onPress={() => {
            setShowLanguages(!showLanguages);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.langSelected}>
            {LANGUAGES[selectedLang].flag} {LANGUAGES[selectedLang].name}
          </Text>
          <ChevronDown size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {showLanguages && (
        <View style={styles.langList}>
          {LANGUAGES.map((lang, idx) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langOption, idx === selectedLang && styles.langOptionActive]}
              onPress={() => {
                setSelectedLang(idx);
                setShowLanguages(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.langOptionText}>{lang.flag} {lang.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!selectedImage && results.length === 0 && (
        <View style={styles.actionSection}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionCard} onPress={handleTakePhoto} testID="take-photo-btn">
              <LinearGradient
                colors={['#6A1B9A', '#8E24AA']}
                style={styles.actionGradient}
              >
                <Camera size={32} color="#fff" />
                <Text style={styles.actionText}>Scatta Foto</Text>
                <Text style={styles.actionSub}>Inquadra il menu</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={handlePickImage} testID="pick-image-btn">
              <LinearGradient
                colors={['#283593', '#3949AB']}
                style={styles.actionGradient}
              >
                <ImageIcon size={32} color="#fff" />
                <Text style={styles.actionText}>Galleria</Text>
                <Text style={styles.actionSub}>Scegli dalla galleria</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>oppure</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.manualSection}>
            <Text style={styles.manualLabel}>Inserisci testo del menu</Text>
            <TextInput
              style={styles.manualInput}
              placeholder="Incolla qui il testo del menu..."
              placeholderTextColor={Colors.textLight}
              value={manualText}
              onChangeText={setManualText}
              multiline
              numberOfLines={4}
              testID="manual-text-input"
            />
            {manualText.trim().length > 0 && (
              <TouchableOpacity style={styles.translateBtn} onPress={handleManualTranslate}>
                <LinearGradient
                  colors={['#6A1B9A', '#8E24AA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.translateGradient}
                >
                  <Languages size={18} color="#fff" />
                  <Text style={styles.translateText}>Traduci</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {selectedImage && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
          <TouchableOpacity style={styles.clearImageBtn} onPress={handleClear}>
            <X size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {isProcessing && (
        <View style={styles.processingCard}>
          <ActivityIndicator size="large" color="#8E24AA" />
          <Text style={styles.processingText}>Analisi e traduzione in corso...</Text>
          <View style={styles.processingSteps}>
            <View style={styles.stepRow}>
              <ScanLine size={14} color="#8E24AA" />
              <Text style={styles.stepText}>Riconoscimento testo (OCR)</Text>
            </View>
            <View style={styles.stepRow}>
              <Languages size={14} color="#8E24AA" />
              <Text style={styles.stepText}>Traduzione automatica</Text>
            </View>
            <View style={styles.stepRow}>
              <AlertTriangle size={14} color="#8E24AA" />
              <Text style={styles.stepText}>Identificazione allergeni</Text>
            </View>
          </View>
        </View>
      )}

      {results.length > 0 && !isProcessing && (
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Piatti Tradotti</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>Nuova scansione</Text>
            </TouchableOpacity>
          </View>
          {results.map((dish, idx) => (
            <DishCard key={idx} dish={dish} />
          ))}

          <View style={styles.allergenLegend}>
            <Text style={styles.legendTitle}>Legenda Allergeni</Text>
            <View style={styles.legendGrid}>
              {ALLERGENS.map((a) => (
                <View key={a.id} style={styles.legendItem}>
                  <Text style={styles.legendIcon}>{a.icon}</Text>
                  <Text style={styles.legendName}>{a.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroCard: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  heroIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSparkle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#fff',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  langLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  langDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  langSelected: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
  },
  langList: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 14,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  langOption: {
    padding: 12,
    borderRadius: 10,
  },
  langOptionActive: {
    backgroundColor: '#F3E5F5',
  },
  langOptionText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500' as const,
  },
  actionSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderRadius: 18,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  actionSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  manualSection: {
    gap: 10,
  },
  manualLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  manualInput: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  translateBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  translateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  translateText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  imagePreview: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  clearImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  processingSteps: {
    gap: 10,
    width: '100%',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  resultsSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#8E24AA',
  },
  dishCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dishTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dishTexts: {
    flex: 1,
  },
  dishOriginal: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  dishTranslated: {
    fontSize: 14,
    color: '#8E24AA',
    fontWeight: '500' as const,
    marginTop: 4,
  },
  allergenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  allergenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  allergenIcon: {
    fontSize: 12,
  },
  allergenName: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  allergenLegend: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '45%',
  },
  legendIcon: {
    fontSize: 16,
  },
  legendName: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
