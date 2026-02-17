import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Compass, Mail, MapPin, Globe, Heart, Star, ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Informazioni', headerShown: true, headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.textPrimary }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#4DD0E1', '#5C8AE6']} style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Compass color={Colors.white} size={36} />
          </View>
          <Text style={styles.appName}>Wanderly Travel App</Text>
          <Text style={styles.version}>Versione 1.0.0</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi Siamo</Text>
          <Text style={styles.cardBody}>
            Wanderly è nata dalla passione per i viaggi e dalla volontà di creare uno strumento completo per ogni viaggiatore. La nostra missione è rendere ogni viaggio un'esperienza indimenticabile, fornendo strumenti intelligenti per pianificare, organizzare e ricordare le tue avventure.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>La Nostra Storia</Text>
          <Text style={styles.cardBody}>
            Fondata nel 2025 da un team di viaggiatori appassionati e sviluppatori italiani, Wanderly è il frutto di anni di esperienza nel mondo dei viaggi. Abbiamo creato l'app che avremmo sempre voluto avere durante i nostri viaggi: semplice, completa e bella da usare.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cosa Offriamo</Text>
          <View style={styles.featureList}>
            <FeatureItem icon={MapPin} text="Pianificazione viaggi intelligente" />
            <FeatureItem icon={Globe} text="Strumenti per oltre 50 paesi" />
            <FeatureItem icon={Heart} text="Diario di viaggio personale" />
            <FeatureItem icon={Star} text="Quiz sul profilo viaggiatore" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contattaci</Text>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:info@wanderlyapp.com')} activeOpacity={0.7}>
            <Mail color={Colors.tealDark} size={18} />
            <Text style={styles.contactText}>info@wanderlyapp.com</Text>
            <ExternalLink color={Colors.textLight} size={14} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('https://wanderlyapp.com')} activeOpacity={0.7}>
            <Globe color={Colors.tealDark} size={18} />
            <Text style={styles.contactText}>www.wanderlyapp.com</Text>
            <ExternalLink color={Colors.textLight} size={14} />
          </TouchableOpacity>
          <View style={styles.contactRow}>
            <MapPin color={Colors.tealDark} size={18} />
            <Text style={styles.contactText}>Via dei Viaggiatori 42, Roma</Text>
          </View>
        </View>

        <Text style={styles.footer}>Made with {'\u2764'} in Italia</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function FeatureItem({ icon: Icon, text }: { icon: React.ComponentType<{ color: string; size: number }>; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot}>
        <Icon color={Colors.tealDark} size={16} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
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
  heroCard: {
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  contactText: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 12,
  },
});
