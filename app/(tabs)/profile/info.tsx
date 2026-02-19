import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Compass, Mail, MapPin, Globe, Heart, Star, ExternalLink, Briefcase } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function InfoScreen() {
  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#4DD0E1', '#5C8AE6']} style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Compass color={Colors.white} size={36} />
          </View>
          <Text style={styles.appName}>Che Viaggiatore Sei?</Text>
          <Text style={styles.version}>Versione 1.0.0</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi Siamo</Text>
          <Text style={styles.cardBody}>
            "Che Viaggiatore Sei?" è un'app sviluppata da Steo&Davi Lab di Di Tria Stefano, una realtà italiana nata dalla passione per i viaggi e la tecnologia. La nostra missione è creare strumenti intelligenti e intuitivi per accompagnare ogni viaggiatore nella pianificazione, organizzazione e nel ricordo delle proprie avventure.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>La Nostra Visione</Text>
          <Text style={styles.cardBody}>
            Crediamo che ogni viaggio sia un'esperienza unica e irripetibile. Per questo abbiamo creato un'app completa che unisce utilità pratiche, ispirazione e divertimento: dal quiz per scoprire il tuo profilo di viaggiatore, al diario per custodire i tuoi ricordi, fino agli strumenti che ti servono davvero quando sei in viaggio.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cosa Offriamo</Text>
          <View style={styles.featureList}>
            <FeatureItem icon={Star} text="Quiz interattivo sul profilo viaggiatore" />
            <FeatureItem icon={Heart} text="Diario di viaggio personale" />
            <FeatureItem icon={MapPin} text="Destinazioni e informazioni utili" />
            <FeatureItem icon={Globe} text="Strumenti di utilità per oltre 50 paesi" />
            <FeatureItem icon={Briefcase} text="Gestione budget, checklist e pianificazione" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dati Aziendali</Text>
          <Text style={styles.cardBody}>
            Steo&Davi Lab di Di Tria Stefano{'\n'}
            Partita IVA: 10549650017{'\n'}
            Sede: Italia
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contattaci</Text>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:steodavilab@gmail.com')} activeOpacity={0.7}>
            <Mail color={Colors.tealDark} size={18} />
            <Text style={styles.contactText}>steodavilab@gmail.com</Text>
            <ExternalLink color={Colors.textLight} size={14} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crediti e Licenze</Text>
          <Text style={styles.cardBody}>
            L'App utilizza le seguenti tecnologie e servizi di terze parti:{'\n\n'}
            • React Native / Expo — Framework di sviluppo{'\n'}
            • Google AdMob — Gestione annunci pubblicitari{'\n'}
            • Lucide Icons — Set di icone open source{'\n'}
            • Le immagini e i contenuti editoriali sono di proprietà di Steo&Davi Lab o utilizzati su licenza{'\n\n'}
            Tutti i marchi citati appartengono ai rispettivi proprietari.
          </Text>
        </View>

        <Text style={styles.footer}>Made with {'\u2764'} in Italia{'\n'}© 2026 Steo&Davi Lab di Di Tria Stefano</Text>
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
    lineHeight: 20,
  },
});
