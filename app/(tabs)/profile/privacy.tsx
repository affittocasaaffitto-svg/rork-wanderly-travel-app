import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Privacy Policy', headerShown: true, headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.textPrimary }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdate}>Ultimo aggiornamento: 15 Febbraio 2026</Text>

        <Text style={styles.intro}>
          La presente Privacy Policy descrive le modalità di raccolta, utilizzo e protezione dei tuoi dati personali quando utilizzi Wanderly Travel App, in conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR - Regolamento UE 2016/679) e la normativa italiana vigente.
        </Text>

        <Text style={styles.heading}>1. Titolare del Trattamento</Text>
        <Text style={styles.body}>
          Il Titolare del trattamento dei dati è Wanderly S.r.l., con sede in Via dei Viaggiatori 42, 00100 Roma, Italia.{'\n'}
          Email: privacy@wanderlyapp.com{'\n'}
          PEC: wanderly@pec.it
        </Text>

        <Text style={styles.heading}>2. Dati Raccolti</Text>
        <Text style={styles.body}>
          Raccogliamo le seguenti categorie di dati personali:{'\n\n'}
          <Text style={styles.bold}>Dati forniti volontariamente:</Text>{'\n'}
          • Nome e cognome{'\n'}
          • Indirizzo email{'\n'}
          • Preferenze di viaggio{'\n'}
          • Contenuti del diario di viaggio{'\n'}
          • Itinerari e destinazioni salvate{'\n\n'}
          <Text style={styles.bold}>Dati raccolti automaticamente:</Text>{'\n'}
          • Dati di utilizzo dell'app{'\n'}
          • Tipo di dispositivo e sistema operativo{'\n'}
          • Indirizzo IP{'\n'}
          • Dati di geolocalizzazione (solo con il tuo consenso){'\n'}
          • Cookie e tecnologie simili
        </Text>

        <Text style={styles.heading}>3. Finalità del Trattamento</Text>
        <Text style={styles.body}>
          I tuoi dati personali sono trattati per le seguenti finalità:{'\n\n'}
          • Fornitura e miglioramento del servizio{'\n'}
          • Personalizzazione dell'esperienza utente{'\n'}
          • Gestione dell'account e supporto clienti{'\n'}
          • Invio di comunicazioni relative al servizio{'\n'}
          • Analisi statistiche e miglioramento dell'app{'\n'}
          • Adempimento di obblighi legali e normativi{'\n'}
          • Prevenzione di frodi e attività illecite
        </Text>

        <Text style={styles.heading}>4. Base Giuridica</Text>
        <Text style={styles.body}>
          Il trattamento dei tuoi dati si basa su:{'\n\n'}
          • Il tuo consenso esplicito (art. 6.1.a GDPR){'\n'}
          • L'esecuzione del contratto di servizio (art. 6.1.b GDPR){'\n'}
          • Il legittimo interesse del Titolare (art. 6.1.f GDPR){'\n'}
          • L'adempimento di obblighi legali (art. 6.1.c GDPR)
        </Text>

        <Text style={styles.heading}>5. Cookie e Tecnologie di Tracciamento</Text>
        <Text style={styles.body}>
          Wanderly utilizza cookie e tecnologie simili per migliorare la tua esperienza:{'\n\n'}
          <Text style={styles.bold}>Cookie Tecnici (necessari):</Text>{'\n'}
          Essenziali per il funzionamento dell'app, la gestione della sessione e le preferenze dell'utente.{'\n\n'}
          <Text style={styles.bold}>Cookie Analitici:</Text>{'\n'}
          Utilizzati per raccogliere informazioni anonime sull'uso dell'app e migliorare il servizio.{'\n\n'}
          <Text style={styles.bold}>Cookie di Profilazione:</Text>{'\n'}
          Utilizzati solo con il tuo consenso esplicito per offrirti contenuti personalizzati.{'\n\n'}
          Puoi gestire le tue preferenze sui cookie nelle impostazioni dell'app in qualsiasi momento.
        </Text>

        <Text style={styles.heading}>6. Conservazione dei Dati</Text>
        <Text style={styles.body}>
          I tuoi dati personali saranno conservati per il tempo necessario al raggiungimento delle finalità per cui sono stati raccolti e comunque non oltre:{'\n\n'}
          • Dati dell'account: per tutta la durata del rapporto e fino a 12 mesi dopo la cancellazione{'\n'}
          • Dati di utilizzo: 24 mesi dalla raccolta{'\n'}
          • Dati per obblighi legali: secondo i termini di legge applicabili
        </Text>

        <Text style={styles.heading}>7. Condivisione dei Dati</Text>
        <Text style={styles.body}>
          I tuoi dati personali non vengono venduti a terzi. Possono essere condivisi con:{'\n\n'}
          • Fornitori di servizi tecnologici (hosting, analytics){'\n'}
          • Autorità competenti, se richiesto dalla legge{'\n'}
          • Partner selezionati, solo con il tuo consenso esplicito{'\n\n'}
          Tutti i terzi che trattano dati per nostro conto sono vincolati da accordi di protezione dei dati conformi al GDPR.
        </Text>

        <Text style={styles.heading}>8. I Tuoi Diritti</Text>
        <Text style={styles.body}>
          In conformità con il GDPR, hai i seguenti diritti:{'\n\n'}
          • <Text style={styles.bold}>Accesso:</Text> richiedere copia dei tuoi dati personali{'\n'}
          • <Text style={styles.bold}>Rettifica:</Text> correggere dati inesatti o incompleti{'\n'}
          • <Text style={styles.bold}>Cancellazione:</Text> richiedere la cancellazione dei tuoi dati{'\n'}
          • <Text style={styles.bold}>Limitazione:</Text> limitare il trattamento dei tuoi dati{'\n'}
          • <Text style={styles.bold}>Portabilità:</Text> ricevere i tuoi dati in formato strutturato{'\n'}
          • <Text style={styles.bold}>Opposizione:</Text> opporti al trattamento dei tuoi dati{'\n'}
          • <Text style={styles.bold}>Revoca del consenso:</Text> ritirare il consenso in qualsiasi momento{'\n\n'}
          Per esercitare i tuoi diritti, contattaci a: privacy@wanderlyapp.com
        </Text>

        <Text style={styles.heading}>9. Sicurezza dei Dati</Text>
        <Text style={styles.body}>
          Adottiamo misure tecniche e organizzative adeguate per proteggere i tuoi dati personali, tra cui crittografia dei dati in transito e a riposo, controlli di accesso, backup regolari e monitoraggio continuo della sicurezza.
        </Text>

        <Text style={styles.heading}>10. Trasferimento Internazionale</Text>
        <Text style={styles.body}>
          I tuoi dati possono essere trasferiti e archiviati su server situati al di fuori del tuo paese di residenza. In tali casi, garantiamo che il trasferimento avvenga in conformità con il GDPR, attraverso clausole contrattuali standard o altri meccanismi approvati.
        </Text>

        <Text style={styles.heading}>11. Minori</Text>
        <Text style={styles.body}>
          Il nostro servizio non è destinato a minori di 16 anni. Non raccogliamo consapevolmente dati personali di minori senza il consenso dei genitori o tutori legali.
        </Text>

        <Text style={styles.heading}>12. Modifiche alla Privacy Policy</Text>
        <Text style={styles.body}>
          Ci riserviamo il diritto di aggiornare questa Privacy Policy. Le modifiche saranno comunicate tramite l'app e/o via email. Ti invitiamo a consultare regolarmente questa pagina.
        </Text>

        <Text style={styles.heading}>13. Contatti e Reclami</Text>
        <Text style={styles.body}>
          Per qualsiasi domanda relativa alla privacy:{'\n\n'}
          Email: privacy@wanderlyapp.com{'\n'}
          DPO: dpo@wanderlyapp.com{'\n'}
          Indirizzo: Via dei Viaggiatori 42, 00100 Roma, Italia{'\n\n'}
          Hai inoltre il diritto di presentare un reclamo all'Autorità Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).
        </Text>

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
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  lastUpdate: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 16,
    fontStyle: 'italic' as const,
  },
  intro: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  heading: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  bold: {
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
});
