import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Camera, User } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState<string>('Marco Rossi');
  const [email, setEmail] = useState<string>('marco.rossi@email.com');
  const [bio, setBio] = useState<string>('Viaggiatore appassionato');
  const [city, setCity] = useState<string>('Roma');
  const [phone, setPhone] = useState<string>('+39 333 1234567');

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Salvato', 'Profilo aggiornato con successo!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User color={Colors.tealDark} size={36} />
          </View>
          <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
            <Camera color={Colors.white} size={16} />
          </TouchableOpacity>
          <Text style={styles.changePhoto}>Cambia foto</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Il tuo nome" placeholderTextColor={Colors.textLight} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="La tua email" placeholderTextColor={Colors.textLight} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Telefono</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Il tuo numero" placeholderTextColor={Colors.textLight} keyboardType="phone-pad" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Città</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="La tua città" placeholderTextColor={Colors.textLight} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Bio</Text>
            <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} placeholder="Racconta qualcosa di te..." placeholderTextColor={Colors.textLight} multiline numberOfLines={3} />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Salva Modifiche</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.8} onPress={() => Alert.alert('Eliminazione Account', 'Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.', [{ text: 'Annulla', style: 'cancel' }, { text: 'Elimina', style: 'destructive' }])}>
          <Text style={styles.deleteBtnText}>Elimina Account</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.teal,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 24,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  changePhoto: {
    fontSize: 14,
    color: Colors.tealDark,
    fontWeight: '600' as const,
    marginTop: 8,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: Colors.tealDark,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  deleteBtn: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  deleteBtnText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '600' as const,
  },
});
