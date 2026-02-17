import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Dimensions,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import {
  Camera,
  ImageIcon,
  Trash2,
  X,
  ScanLine,
  FileText,
  Calendar,
  User,
  Hash,
  Globe,
  Plus,
  ZoomIn,
  ChevronDown,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const STORAGE_KEY = 'scanned_documents';

type ScanDocType = 'passport' | 'id_card' | 'visa' | 'boarding_pass' | 'other';

interface ScannedDocument {
  id: string;
  type: ScanDocType;
  label: string;
  imageUri: string;
  holder: string;
  documentNumber: string;
  expiryDate: string;
  country: string;
  notes: string;
  scannedAt: number;
}

interface DocTypeOption {
  type: ScanDocType;
  label: string;
  color: string;
}

const DOC_TYPE_OPTIONS: DocTypeOption[] = [
  { type: 'passport', label: 'Passaporto', color: '#1565C0' },
  { type: 'id_card', label: 'Carta d\'Identità', color: '#00695C' },
  { type: 'visa', label: 'Visto', color: '#6A1B9A' },
  { type: 'boarding_pass', label: 'Carta d\'Imbarco', color: '#D84315' },
  { type: 'other', label: 'Altro', color: '#37474F' },
];

function getDocTypeOption(type: ScanDocType): DocTypeOption {
  return DOC_TYPE_OPTIONS.find(d => d.type === type) ?? DOC_TYPE_OPTIONS[4];
}

function ScannedDocCard({ doc, index, onDelete, onView }: {
  doc: ScannedDocument;
  index: number;
  onDelete: (id: string) => void;
  onView: (doc: ScannedDocument) => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 80, useNativeDriver: true, tension: 50, friction: 8 }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const docOption = getDocTypeOption(doc.type);
  const dateStr = new Date(doc.scannedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Animated.View style={[styles.docCardWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onView(doc)}
        testID={`scanned-doc-${doc.id}`}
      >
        <View style={styles.docCard}>
          <Image source={{ uri: doc.imageUri }} style={styles.docThumb} resizeMode="cover" />
          <View style={styles.docInfo}>
            <View style={[styles.docTypeBadge, { backgroundColor: docOption.color + '18' }]}>
              <Text style={[styles.docTypeBadgeText, { color: docOption.color }]}>{docOption.label}</Text>
            </View>
            <Text style={styles.docLabel} numberOfLines={1}>{doc.label}</Text>
            {doc.holder ? <Text style={styles.docHolder} numberOfLines={1}>{doc.holder}</Text> : null}
            <Text style={styles.docDate}>Scansionato il {dateStr}</Text>
          </View>
          <View style={styles.docActions}>
            <TouchableOpacity
              onPress={() => onView(doc)}
              style={styles.docActionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ZoomIn size={18} color="#1565C0" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                Alert.alert('Elimina', `Eliminare "${doc.label}"?`, [
                  { text: 'Annulla', style: 'cancel' },
                  { text: 'Elimina', style: 'destructive', onPress: () => onDelete(doc.id) },
                ]);
              }}
              style={styles.docActionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={18} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ScanDocumentsScreen() {
  const [documents, setDocuments] = useState<ScannedDocument[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [pendingImageUri, setPendingImageUri] = useState<string>('');
  const [selectedType, setSelectedType] = useState<ScanDocType>('passport');
  const [showTypePicker, setShowTypePicker] = useState<boolean>(false);
  const [form, setForm] = useState({
    label: '',
    holder: '',
    documentNumber: '',
    expiryDate: '',
    country: '',
    notes: '',
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDocuments(JSON.parse(stored));
        console.log('Loaded scanned documents:', JSON.parse(stored).length);
      }
    } catch (e) {
      console.log('Error loading scanned documents:', e);
    }
  };

  const saveDocuments = async (docs: ScannedDocument[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
      console.log('Saved scanned documents:', docs.length);
    } catch (e) {
      console.log('Error saving scanned documents:', e);
    }
  };

  const resetForm = () => {
    setForm({ label: '', holder: '', documentNumber: '', expiryDate: '', country: '', notes: '' });
    setSelectedType('passport');
    setPendingImageUri('');
    setShowTypePicker(false);
  };

  const takePhoto = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso Negato', 'Devi concedere l\'accesso alla fotocamera per scansionare documenti.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Photo taken:', result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setPendingImageUri(result.assets[0].uri);
        setShowAddForm(true);
      }
    } catch (e) {
      console.log('Error taking photo:', e);
      Alert.alert('Errore', 'Impossibile scattare la foto. Riprova.');
    }
  }, []);

  const pickFromGallery = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso Negato', 'Devi concedere l\'accesso alla galleria.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Image picked:', result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setPendingImageUri(result.assets[0].uri);
        setShowAddForm(true);
      }
    } catch (e) {
      console.log('Error picking image:', e);
      Alert.alert('Errore', 'Impossibile selezionare l\'immagine. Riprova.');
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!form.label.trim()) {
      Alert.alert('Errore', 'Inserisci un nome per il documento');
      return;
    }
    if (!pendingImageUri) {
      Alert.alert('Errore', 'Nessuna immagine scansionata');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newDoc: ScannedDocument = {
      id: Date.now().toString(),
      type: selectedType,
      label: form.label.trim(),
      imageUri: pendingImageUri,
      holder: form.holder.trim(),
      documentNumber: form.documentNumber.trim(),
      expiryDate: form.expiryDate.trim(),
      country: form.country.trim(),
      notes: form.notes.trim(),
      scannedAt: Date.now(),
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveDocuments(updated);
    resetForm();
    setShowAddForm(false);
  }, [form, selectedType, pendingImageUri, documents]);

  const handleDelete = useCallback((id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    saveDocuments(updated);
  }, [documents]);

  const handleView = useCallback((doc: ScannedDocument) => {
    setSelectedDoc(doc);
    setShowDetails(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const docOption = getDocTypeOption(selectedType);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.scanActions}>
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              takePhoto();
            }}
            activeOpacity={0.85}
            testID="scan-camera-btn"
          >
            <LinearGradient colors={['#0277BD', '#01579B']} style={styles.scanBtnGradient}>
              <Camera size={28} color="#fff" />
              <Text style={styles.scanBtnTitle}>Scansiona</Text>
              <Text style={styles.scanBtnDesc}>Usa la fotocamera</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              pickFromGallery();
            }}
            activeOpacity={0.85}
            testID="scan-gallery-btn"
          >
            <LinearGradient colors={['#00897B', '#00695C']} style={styles.scanBtnGradient}>
              <ImageIcon size={28} color="#fff" />
              <Text style={styles.scanBtnTitle}>Galleria</Text>
              <Text style={styles.scanBtnDesc}>Scegli un'immagine</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.tipCard}>
          <ScanLine size={18} color="#0277BD" />
          <Text style={styles.tipText}>Posiziona il documento su una superficie piana e ben illuminata per risultati migliori.</Text>
        </View>

        {documents.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <FileText size={44} color={Colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>Nessun documento scansionato</Text>
            <Text style={styles.emptyDesc}>Scansiona passaporto, carta d'identità o altri documenti di viaggio per averli sempre con te.</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.listHeader}>Documenti Scansionati ({documents.length})</Text>
            {documents.map((doc, index) => (
              <ScannedDocCard key={doc.id} doc={doc} index={index} onDelete={handleDelete} onView={handleView} />
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal visible={showDetails} animationType="fade" transparent onRequestClose={() => setShowDetails(false)}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity style={styles.previewClose} onPress={() => setShowDetails(false)} testID="close-preview">
            <X size={24} color="#fff" />
          </TouchableOpacity>
          {selectedDoc && (
            <ScrollView contentContainerStyle={styles.previewScroll} showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedDoc.imageUri }} style={styles.previewImage} resizeMode="contain" />
              <View style={styles.previewInfo}>
                <Text style={styles.previewTitle}>{selectedDoc.label}</Text>
                {selectedDoc.holder ? (
                  <View style={styles.previewRow}>
                    <User size={14} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.previewText}>{selectedDoc.holder}</Text>
                  </View>
                ) : null}
                {selectedDoc.documentNumber ? (
                  <View style={styles.previewRow}>
                    <Hash size={14} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.previewText}>{selectedDoc.documentNumber}</Text>
                  </View>
                ) : null}
                {selectedDoc.expiryDate ? (
                  <View style={styles.previewRow}>
                    <Calendar size={14} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.previewText}>Scade: {selectedDoc.expiryDate}</Text>
                  </View>
                ) : null}
                {selectedDoc.country ? (
                  <View style={styles.previewRow}>
                    <Globe size={14} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.previewText}>{selectedDoc.country}</Text>
                  </View>
                ) : null}
                {selectedDoc.notes ? (
                  <Text style={styles.previewNotes}>{selectedDoc.notes}</Text>
                ) : null}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      <Modal visible={showAddForm} animationType="slide" transparent onRequestClose={() => { setShowAddForm(false); resetForm(); }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formOverlay}>
          <View style={styles.formSheet}>
            <View style={styles.formHandle} />
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Dettagli Documento</Text>
              <TouchableOpacity onPress={() => { setShowAddForm(false); resetForm(); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
              {pendingImageUri ? (
                <Image source={{ uri: pendingImageUri }} style={styles.formPreviewImage} resizeMode="cover" />
              ) : null}

              <Text style={styles.inputLabel}>Tipo Documento</Text>
              <TouchableOpacity style={styles.typePicker} onPress={() => setShowTypePicker(!showTypePicker)} testID="scan-type-picker">
                <View style={styles.typePickerInner}>
                  <View style={[styles.typePickerDot, { backgroundColor: docOption.color }]} />
                  <Text style={styles.typePickerText}>{docOption.label}</Text>
                </View>
                <ChevronDown size={18} color={Colors.textSecondary} />
              </TouchableOpacity>

              {showTypePicker && (
                <View style={styles.typeOptions}>
                  {DOC_TYPE_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.type}
                      style={[styles.typeOption, selectedType === opt.type && styles.typeOptionActive]}
                      onPress={() => {
                        setSelectedType(opt.type);
                        setShowTypePicker(false);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <View style={[styles.typePickerDot, { backgroundColor: opt.color }]} />
                      <Text style={[styles.typeOptionText, selectedType === opt.type && { color: opt.color, fontWeight: '700' as const }]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.inputLabel}>Nome Documento *</Text>
              <TextInput
                style={styles.input}
                placeholder="es. Passaporto Italia"
                placeholderTextColor={Colors.textLight}
                value={form.label}
                onChangeText={t => setForm(f => ({ ...f, label: t }))}
                testID="scan-input-label"
              />

              <Text style={styles.inputLabel}>Intestatario</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome e cognome"
                placeholderTextColor={Colors.textLight}
                value={form.holder}
                onChangeText={t => setForm(f => ({ ...f, holder: t }))}
                testID="scan-input-holder"
              />

              <Text style={styles.inputLabel}>Numero Documento</Text>
              <TextInput
                style={styles.input}
                placeholder="es. AA1234567"
                placeholderTextColor={Colors.textLight}
                value={form.documentNumber}
                onChangeText={t => setForm(f => ({ ...f, documentNumber: t }))}
                autoCapitalize="characters"
                testID="scan-input-number"
              />

              <View style={styles.row}>
                <View style={styles.halfField}>
                  <Text style={styles.inputLabel}>Scadenza</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="GG/MM/AAAA"
                    placeholderTextColor={Colors.textLight}
                    value={form.expiryDate}
                    onChangeText={t => setForm(f => ({ ...f, expiryDate: t }))}
                    testID="scan-input-expiry"
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.inputLabel}>Paese</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="es. Italia"
                    placeholderTextColor={Colors.textLight}
                    value={form.country}
                    onChangeText={t => setForm(f => ({ ...f, country: t }))}
                    testID="scan-input-country"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Note</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Appunti aggiuntivi..."
                placeholderTextColor={Colors.textLight}
                value={form.notes}
                onChangeText={t => setForm(f => ({ ...f, notes: t }))}
                multiline
                numberOfLines={3}
                testID="scan-input-notes"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85} testID="save-scanned-doc">
                <LinearGradient colors={['#0277BD', '#01579B']} style={styles.saveGradient}>
                  <Text style={styles.saveText}>Salva Documento</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scanActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  scanBtn: {
    flex: 1,
  },
  scanBtnGradient: {
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  scanBtnTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
    marginTop: 8,
  },
  scanBtnDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#0277BD',
    lineHeight: 17,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8ECF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 19,
  },
  listHeader: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  docCardWrapper: {
    marginBottom: 12,
  },
  docCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  docThumb: {
    width: 90,
    height: 100,
    backgroundColor: '#E8ECF0',
  },
  docInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  docTypeBadge: {
    alignSelf: 'flex-start' as const,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  docTypeBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  docLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  docHolder: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  docDate: {
    fontSize: 11,
    color: Colors.textLight,
  },
  docActions: {
    justifyContent: 'center',
    paddingRight: 12,
    gap: 12,
  },
  docActionBtn: {
    padding: 6,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewScroll: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  previewImage: {
    width: width - 40,
    height: (width - 40) * 0.75,
    borderRadius: 16,
    backgroundColor: '#222',
  },
  previewInfo: {
    marginTop: 20,
    width: '100%',
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#fff',
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  previewNotes: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 12,
    lineHeight: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
  },
  formOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  formSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  formHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  formScroll: {
    flexGrow: 0,
  },
  formPreviewImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: '#E8ECF0',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  typePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  typePickerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  typePickerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  typePickerText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  typeOptions: {
    backgroundColor: '#F5F7FA',
    borderRadius: 14,
    marginTop: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  typeOptionActive: {
    backgroundColor: 'rgba(2,119,189,0.08)',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
  },
  saveButton: {
    marginTop: 24,
  },
  saveGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
