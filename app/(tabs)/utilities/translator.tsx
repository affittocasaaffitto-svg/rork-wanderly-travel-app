import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  ArrowUpDown,
  Mic,
  MicOff,
  Copy,
  Volume2,
  Trash2,
  ChevronDown,
  Send,
  Globe,
} from 'lucide-react-native';
import { Audio } from 'expo-av';
import { generateText } from '@rork-ai/toolkit-sdk';
import Colors from '@/constants/colors';

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

interface TranslationEntry {
  id: string;
  sourceText: string;
  translatedText: string;
  fromLang: Language;
  toLang: Language;
  timestamp: number;
}

const LANGUAGES: Language[] = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'en', name: 'Inglese', flag: '🇬🇧', nativeName: 'English' },
  { code: 'es', name: 'Spagnolo', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'Francese', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'Tedesco', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portoghese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'zh', name: 'Cinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ja', name: 'Giapponese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Coreano', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'ar', name: 'Arabo', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'ru', name: 'Russo', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turco', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Olandese', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polacco', flag: '🇵🇱', nativeName: 'Polski' },
  { code: 'sv', name: 'Svedese', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'th', name: 'Tailandese', flag: '🇹🇭', nativeName: 'ไทย' },
  { code: 'el', name: 'Greco', flag: '🇬🇷', nativeName: 'Ελληνικά' },
];

export default function TranslatorScreen() {
  const [fromLangIndex, setFromLangIndex] = useState(0);
  const [toLangIndex, setToLangIndex] = useState(1);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState<TranslationEntry[]>([]);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const webStreamRef = useRef<MediaStream | null>(null);
  const webRecorderRef = useRef<MediaRecorder | null>(null);
  const webChunksRef = useRef<Blob[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  const fromLang = LANGUAGES[fromLangIndex];
  const toLang = LANGUAGES[toLangIndex];

  const startPulse = useCallback(() => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();
  }, [pulseAnim]);

  const stopPulse = useCallback(() => {
    if (pulseLoop.current) {
      pulseLoop.current.stop();
    }
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  const handleTranslate = useCallback(async (text?: string) => {
    const textToTranslate = text ?? inputText;
    if (!textToTranslate.trim()) return;

    setIsTranslating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const prompt = `Translate the following text from ${fromLang.name} (${fromLang.code}) to ${toLang.name} (${toLang.code}). Return ONLY the translated text, nothing else. No quotes, no explanations.\n\nText: "${textToTranslate.trim()}"`;
      console.log('[Translator] Sending translation request:', prompt);

      const result = await generateText(prompt);
      console.log('[Translator] Translation result:', result);

      const cleaned = result.replace(/^["']|["']$/g, '').trim();
      setTranslatedText(cleaned);

      const entry: TranslationEntry = {
        id: Date.now().toString(),
        sourceText: textToTranslate.trim(),
        translatedText: cleaned,
        fromLang,
        toLang,
        timestamp: Date.now(),
      };
      setHistory(prev => [entry, ...prev].slice(0, 20));
    } catch (error) {
      console.error('[Translator] Translation error:', error);
      Alert.alert('Errore', 'Impossibile tradurre il testo. Riprova.');
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, fromLang, toLang]);

  const handleSwapLanguages = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFromLangIndex(toLangIndex);
    setToLangIndex(fromLangIndex);
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  }, [fromLangIndex, toLangIndex, inputText, translatedText]);

  const handleCopy = useCallback(async (text: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        console.log('[Translator] Copy failed on web:', e);
      }
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHistory([]);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      if (Platform.OS === 'web') {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          Alert.alert('Errore', 'Il microfono non è supportato su questo browser.');
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        webStreamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        webRecorderRef.current = recorder;
        webChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            webChunksRef.current.push(e.data);
          }
        };

        recorder.start();
        setIsRecording(true);
        startPulse();
        console.log('[Translator] Web recording started');
      } else {
        const permission = await Audio.requestPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permesso negato', 'È necessario il permesso per il microfono.');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync({
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            outputFormat: Audio.IOSOutputFormat.LINEARPCM,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        });
        await recording.startAsync();
        recordingRef.current = recording;
        setIsRecording(true);
        startPulse();
        console.log('[Translator] Native recording started');
      }
    } catch (error) {
      console.error('[Translator] Failed to start recording:', error);
      setIsRecording(false);
      stopPulse();
      Alert.alert('Errore', 'Impossibile avviare la registrazione. Verifica i permessi del microfono.');
    }
  }, [startPulse, stopPulse]);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    stopPulse();

    try {
      if (Platform.OS === 'web') {
        const recorder = webRecorderRef.current;
        if (!recorder) return;

        await new Promise<void>((resolve) => {
          recorder.onstop = () => resolve();
          recorder.stop();
        });

        if (webStreamRef.current) {
          webStreamRef.current.getTracks().forEach(track => track.stop());
          webStreamRef.current = null;
        }

        const blob = new Blob(webChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        formData.append('language', fromLang.code);

        console.log('[Translator] Sending web audio for transcription...');
        const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('STT request failed');
        const data = await response.json();
        console.log('[Translator] STT result:', data);

        if (data.text) {
          setInputText(data.text);
          handleTranslate(data.text);
        }
      } else {
        const recording = recordingRef.current;
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

        const uri = recording.getURI();
        recordingRef.current = null;

        if (!uri) return;

        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        const audioFile = {
          uri,
          name: 'recording.' + fileType,
          type: 'audio/' + fileType,
        };

        const formData = new FormData();
        formData.append('audio', audioFile as any);
        formData.append('language', fromLang.code);

        console.log('[Translator] Sending native audio for transcription...');
        const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('STT request failed');
        const data = await response.json();
        console.log('[Translator] STT result:', data);

        if (data.text) {
          setInputText(data.text);
          handleTranslate(data.text);
        }
      }
    } catch (error) {
      console.error('[Translator] Recording/transcription error:', error);
      Alert.alert('Errore', 'Impossibile trascrivere l\'audio. Riprova.');
    }
  }, [fromLang.code, handleTranslate, stopPulse]);

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
      if (webStreamRef.current) {
        webStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const renderLanguagePicker = (
    isFrom: boolean,
    visible: boolean,
    setVisible: (v: boolean) => void
  ) => {
    if (!visible) return null;
    return (
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerCard}>
          <Text style={styles.pickerTitle}>Seleziona lingua</Text>
          <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
            {LANGUAGES.map((lang, index) => {
              const isSelected = isFrom ? index === fromLangIndex : index === toLangIndex;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (isFrom) {
                      if (index === toLangIndex) {
                        setToLangIndex(fromLangIndex);
                      }
                      setFromLangIndex(index);
                    } else {
                      if (index === fromLangIndex) {
                        setFromLangIndex(toLangIndex);
                      }
                      setToLangIndex(index);
                    }
                    setVisible(false);
                  }}
                >
                  <Text style={styles.pickerFlag}>{lang.flag}</Text>
                  <View style={styles.pickerTextWrap}>
                    <Text style={[styles.pickerName, isSelected && styles.pickerNameSelected]}>
                      {lang.name}
                    </Text>
                    <Text style={styles.pickerNative}>{lang.nativeName}</Text>
                  </View>
                  {isSelected && <View style={styles.pickerDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.pickerClose} onPress={() => setVisible(false)}>
            <Text style={styles.pickerCloseText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.langBar}>
          <TouchableOpacity
            style={styles.langButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowFromPicker(true);
            }}
          >
            <Text style={styles.langFlag}>{fromLang.flag}</Text>
            <Text style={styles.langName}>{fromLang.name}</Text>
            <ChevronDown color={Colors.textSecondary} size={16} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSwapLanguages} style={styles.swapButton}>
            <LinearGradient
              colors={['#FF8A80', '#FF5252']}
              style={styles.swapGradient}
            >
              <ArrowUpDown color={Colors.white} size={18} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.langButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowToPicker(true);
            }}
          >
            <Text style={styles.langFlag}>{toLang.flag}</Text>
            <Text style={styles.langName}>{toLang.name}</Text>
            <ChevronDown color={Colors.textSecondary} size={16} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLangLabel}>{fromLang.flag} {fromLang.name}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Scrivi il testo da tradurre..."
            placeholderTextColor={Colors.textLight}
            multiline
            textAlignVertical="top"
            testID="translator-input"
          />
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleCopy(inputText)}
              disabled={!inputText}
            >
              <Copy color={inputText ? Colors.textSecondary : Colors.textLight} size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={() => handleTranslate()}
              disabled={!inputText.trim() || isTranslating}
            >
              {isTranslating ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Send color={Colors.white} size={18} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {(translatedText || isTranslating) && (
          <View style={styles.outputCard}>
            <View style={styles.outputHeader}>
              <Text style={styles.outputLangLabel}>{toLang.flag} {toLang.name}</Text>
            </View>
            {isTranslating && !translatedText ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={Colors.teal} size="small" />
                <Text style={styles.loadingText}>Traduzione in corso...</Text>
              </View>
            ) : (
              <Text style={styles.outputText} selectable>{translatedText}</Text>
            )}
            {translatedText ? (
              <View style={styles.outputActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleCopy(translatedText)}>
                  <Copy color={Colors.textSecondary} size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}>
                  <Volume2 color={Colors.textSecondary} size={18} />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        <Animated.View style={[styles.micSection, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonRecording]}
            onPress={isRecording ? stopRecording : startRecording}
            activeOpacity={0.8}
            testID="translator-mic"
          >
            <LinearGradient
              colors={isRecording ? ['#FF5252', '#D32F2F'] : ['#4DD0E1', '#7B68EE']}
              style={styles.micGradient}
            >
              {isRecording ? (
                <MicOff color={Colors.white} size={28} />
              ) : (
                <Mic color={Colors.white} size={28} />
              )}
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.micLabel}>
            {isRecording ? 'Tocca per fermare' : 'Tocca per parlare'}
          </Text>
        </Animated.View>

        <View style={styles.quickLangs}>
          <Text style={styles.quickTitle}>Lingue rapide</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {LANGUAGES.slice(0, 8).map((lang, index) => {
              const isActive = index === toLangIndex;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.quickPill, isActive && styles.quickPillActive]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (index === fromLangIndex) {
                      setFromLangIndex(toLangIndex);
                    }
                    setToLangIndex(index);
                  }}
                >
                  <Text style={styles.quickFlag}>{lang.flag}</Text>
                  <Text style={[styles.quickName, isActive && styles.quickNameActive]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {history.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Cronologia</Text>
              <TouchableOpacity onPress={handleClearHistory} style={styles.clearBtn}>
                <Trash2 color={Colors.coral} size={16} />
                <Text style={styles.clearText}>Cancella</Text>
              </TouchableOpacity>
            </View>
            {history.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.historyCard}
                onPress={() => {
                  setInputText(entry.sourceText);
                  setTranslatedText(entry.translatedText);
                  const fIdx = LANGUAGES.findIndex(l => l.code === entry.fromLang.code);
                  const tIdx = LANGUAGES.findIndex(l => l.code === entry.toLang.code);
                  if (fIdx >= 0) setFromLangIndex(fIdx);
                  if (tIdx >= 0) setToLangIndex(tIdx);
                }}
              >
                <View style={styles.historyRow}>
                  <Text style={styles.historyFlags}>
                    {entry.fromLang.flag} → {entry.toLang.flag}
                  </Text>
                </View>
                <Text style={styles.historySource} numberOfLines={1}>{entry.sourceText}</Text>
                <Text style={styles.historyTranslated} numberOfLines={1}>{entry.translatedText}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {renderLanguagePicker(true, showFromPicker, setShowFromPicker)}
      {renderLanguagePicker(false, showToPicker, setShowToPicker)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  langButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  langFlag: {
    fontSize: 20,
  },
  langName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    flex: 1,
  },
  swapButton: {
    zIndex: 2,
  },
  swapGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  inputLangLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  textInput: {
    fontSize: 17,
    color: Colors.textPrimary,
    minHeight: 100,
    maxHeight: 180,
    lineHeight: 24,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textLight,
  },
  outputCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.purple,
  },
  outputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(123,104,238,0.1)',
  },
  outputLangLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.purple,
  },
  outputText: {
    fontSize: 17,
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  outputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(123,104,238,0.1)',
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  micSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  micButton: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  micButtonRecording: {
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  micGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  quickLangs: {
    marginBottom: 20,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  quickPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  quickPillActive: {
    borderColor: Colors.teal,
    backgroundColor: Colors.tealLight,
  },
  quickFlag: {
    fontSize: 16,
  },
  quickName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  quickNameActive: {
    color: Colors.tealDark,
  },
  historySection: {
    marginTop: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: 13,
    color: Colors.coral,
    fontWeight: '600' as const,
  },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyFlags: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  historySource: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  historyTranslated: {
    fontSize: 13,
    color: Colors.purple,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 24,
  },
  pickerCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxHeight: 500,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  pickerList: {
    maxHeight: 360,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 2,
  },
  pickerItemSelected: {
    backgroundColor: Colors.tealLight,
  },
  pickerFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  pickerTextWrap: {
    flex: 1,
  },
  pickerName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  pickerNameSelected: {
    color: Colors.tealDark,
  },
  pickerNative: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  pickerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.teal,
  },
  pickerClose: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  pickerCloseText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
});
