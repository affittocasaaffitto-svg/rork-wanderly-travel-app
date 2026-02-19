import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Privacy Policy', headerShown: true, headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.textPrimary }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdate}>Ultimo aggiornamento: 19 Febbraio 2026</Text>

        <Text style={styles.intro}>
          La presente Informativa sulla Privacy (di seguito "Informativa") è resa ai sensi dell'art. 13 del Regolamento (UE) 2016/679 (GDPR) e del D.Lgs. 196/2003 (Codice Privacy) come modificato dal D.Lgs. 101/2018, e descrive le modalità di raccolta, utilizzo, conservazione e protezione dei dati personali degli utenti dell'applicazione mobile "Che Viaggiatore Sei?" (di seguito "App").
        </Text>

        <Text style={styles.heading}>1. Titolare del Trattamento</Text>
        <Text style={styles.body}>
          Il Titolare del trattamento dei dati personali è:{'\n\n'}
          <Text style={styles.bold}>Steo&Davi Lab di Di Tria Stefano</Text>{'\n'}
          Partita IVA: 10549650017{'\n'}
          Email: steodavilab@gmail.com{'\n\n'}
          (di seguito "Titolare")
        </Text>

        <Text style={styles.heading}>2. Tipologie di Dati Raccolti</Text>
        <Text style={styles.body}>
          L'App può raccogliere le seguenti categorie di dati:{'\n\n'}
          <Text style={styles.bold}>a) Dati forniti volontariamente dall'utente:</Text>{'\n'}
          • Nome e preferenze di viaggio inserite nel profilo{'\n'}
          • Contenuti del diario di viaggio{'\n'}
          • Risposte ai quiz{'\n'}
          • Itinerari, destinazioni e checklist salvate{'\n'}
          • Budget e note di viaggio{'\n\n'}
          <Text style={styles.bold}>b) Dati raccolti automaticamente:</Text>{'\n'}
          • Dati tecnici del dispositivo (tipo, sistema operativo, versione dell'App){'\n'}
          • Identificatori pubblicitari (IDFA/GAID) per la gestione degli annunci{'\n'}
          • Dati di utilizzo e interazione con l'App{'\n'}
          • Indirizzo IP (in forma anonimizzata){'\n\n'}
          <Text style={styles.bold}>c) Dati raccolti tramite servizi terzi:</Text>{'\n'}
          • Google AdMob: dati relativi alla visualizzazione di annunci pubblicitari{'\n'}
          • Servizi di analisi anonima per il miglioramento dell'App
        </Text>

        <Text style={styles.heading}>3. Finalità e Base Giuridica del Trattamento</Text>
        <Text style={styles.body}>
          I dati personali sono trattati per le seguenti finalità:{'\n\n'}
          <Text style={styles.bold}>a) Erogazione del servizio</Text> (base giuridica: art. 6.1.b GDPR — esecuzione del contratto){'\n'}
          • Funzionamento dell'App e delle sue funzionalità{'\n'}
          • Salvataggio locale delle preferenze e dei contenuti dell'utente{'\n'}
          • Personalizzazione dell'esperienza d'uso{'\n\n'}
          <Text style={styles.bold}>b) Pubblicità</Text> (base giuridica: art. 6.1.a GDPR — consenso){'\n'}
          • Visualizzazione di annunci pubblicitari tramite Google AdMob{'\n'}
          • Gestione dei Rewarded Ads (video volontari per sbloccare contenuti){'\n\n'}
          <Text style={styles.bold}>c) Miglioramento del servizio</Text> (base giuridica: art. 6.1.f GDPR — legittimo interesse){'\n'}
          • Analisi anonime sull'utilizzo dell'App{'\n'}
          • Individuazione e correzione di errori tecnici{'\n\n'}
          <Text style={styles.bold}>d) Obblighi di legge</Text> (base giuridica: art. 6.1.c GDPR){'\n'}
          • Adempimento di obblighi fiscali, contabili e normativi
        </Text>

        <Text style={styles.heading}>4. Modalità del Trattamento</Text>
        <Text style={styles.body}>
          Il trattamento dei dati è effettuato con strumenti elettronici e informatici, con logiche strettamente correlate alle finalità sopra indicate e comunque in modo da garantirne la sicurezza, l'integrità e la riservatezza ai sensi dell'art. 32 GDPR.{'\n\n'}I dati dell'utente (diario, itinerari, checklist, quiz) sono salvati prevalentemente in locale sul dispositivo dell'utente tramite archiviazione locale (AsyncStorage). Il Titolare non accede a tali dati salvo che l'utente non li trasmetta volontariamente.
        </Text>

        <Text style={styles.heading}>5. Cookie e Tecnologie di Tracciamento</Text>
        <Text style={styles.body}>
          L'App può utilizzare tecnologie di tracciamento equivalenti ai cookie per le seguenti finalità:{'\n\n'}
          <Text style={styles.bold}>Tecniche/funzionali (necessarie):</Text>{'\n'}
          Essenziali per il funzionamento dell'App, la gestione della sessione e il salvataggio delle preferenze dell'utente.{'\n\n'}
          <Text style={styles.bold}>Pubblicitarie (previo consenso):</Text>{'\n'}
          Utilizzate da Google AdMob per la visualizzazione di annunci pertinenti. L'utente può revocare il consenso in qualsiasi momento tramite le impostazioni del dispositivo.{'\n\n'}
          Per maggiori informazioni sulla privacy di Google AdMob:{'\n'}
          https://policies.google.com/privacy
        </Text>

        <Text style={styles.heading}>6. Conservazione dei Dati</Text>
        <Text style={styles.body}>
          I dati personali sono conservati per il tempo strettamente necessario al raggiungimento delle finalità per cui sono stati raccolti:{'\n\n'}
          • Dati dell'App (profilo, preferenze): per tutta la durata di utilizzo dell'App e fino alla disinstallazione{'\n'}
          • Dati di utilizzo anonimi: massimo 26 mesi dalla raccolta{'\n'}
          • Dati per obblighi legali/fiscali: per i termini previsti dalla normativa vigente (10 anni per obblighi fiscali){'\n\n'}Al termine del periodo di conservazione, i dati saranno cancellati o resi anonimi in modo irreversibile.
        </Text>

        <Text style={styles.heading}>7. Comunicazione e Trasferimento dei Dati</Text>
        <Text style={styles.body}>
          I dati personali non vengono venduti a terzi. Possono essere comunicati a:{'\n\n'}
          • <Text style={styles.bold}>Google LLC</Text> (Google AdMob): per la gestione degli annunci pubblicitari. Google opera come Titolare autonomo del trattamento. I dati possono essere trasferiti negli USA sulla base delle Standard Contractual Clauses (SCC) approvate dalla Commissione Europea.{'\n\n'}
          • <Text style={styles.bold}>Fornitori di servizi tecnici</Text>: hosting, assistenza tecnica, analisi, che agiscono come Responsabili del trattamento ai sensi dell'art. 28 GDPR.{'\n\n'}
          • <Text style={styles.bold}>Autorità competenti</Text>: ove richiesto dalla legge o da provvedimenti dell'autorità giudiziaria.
        </Text>

        <Text style={styles.heading}>8. Diritti dell'Interessato</Text>
        <Text style={styles.body}>
          Ai sensi degli artt. 15-22 del GDPR, l'utente ha il diritto di:{'\n\n'}
          • <Text style={styles.bold}>Accesso</Text> (art. 15): ottenere conferma dell'esistenza di un trattamento e accedere ai propri dati{'\n'}
          • <Text style={styles.bold}>Rettifica</Text> (art. 16): ottenere la correzione di dati inesatti o l'integrazione di dati incompleti{'\n'}
          • <Text style={styles.bold}>Cancellazione</Text> (art. 17): ottenere la cancellazione dei propri dati ("diritto all'oblio"){'\n'}
          • <Text style={styles.bold}>Limitazione</Text> (art. 18): ottenere la limitazione del trattamento{'\n'}
          • <Text style={styles.bold}>Portabilità</Text> (art. 20): ricevere i propri dati in formato strutturato e leggibile da dispositivo automatico{'\n'}
          • <Text style={styles.bold}>Opposizione</Text> (art. 21): opporsi al trattamento dei propri dati{'\n'}
          • <Text style={styles.bold}>Revoca del consenso</Text> (art. 7): revocare il consenso prestato in qualsiasi momento, senza pregiudizio per la liceità del trattamento basato sul consenso prima della revoca{'\n\n'}
          Per esercitare i propri diritti, l'utente può inviare una richiesta a:{'\n'}
          Email: steodavilab@gmail.com{'\n\n'}Il Titolare fornirà riscontro entro 30 giorni dalla ricezione della richiesta, come previsto dall'art. 12 GDPR.
        </Text>

        <Text style={styles.heading}>9. Sicurezza dei Dati</Text>
        <Text style={styles.body}>
          Il Titolare adotta misure tecniche e organizzative appropriate ai sensi dell'art. 32 GDPR per proteggere i dati personali, tra cui:{'\n\n'}
          • Archiviazione locale sicura sul dispositivo dell'utente{'\n'}
          • Crittografia dei dati in transito (HTTPS/TLS){'\n'}
          • Controlli di accesso e procedure di sicurezza{'\n'}
          • Aggiornamenti regolari delle componenti software
        </Text>

        <Text style={styles.heading}>10. Dati dei Minori</Text>
        <Text style={styles.body}>
          L'App non è destinata a minori di 16 anni. Il Titolare non raccoglie consapevolmente dati personali di minori di 16 anni senza il consenso verificabile dei genitori o tutori legali, in conformità all'art. 8 GDPR e all'art. 2-quinquies del Codice Privacy. Qualora il Titolare venga a conoscenza di aver raccolto dati di un minore senza il necessario consenso, provvederà alla loro tempestiva cancellazione.
        </Text>

        <Text style={styles.heading}>11. Modifiche alla Privacy Policy</Text>
        <Text style={styles.body}>
          Il Titolare si riserva il diritto di aggiornare la presente Informativa in qualsiasi momento. Le modifiche sostanziali saranno comunicate tramite l'App. L'utente è invitato a consultare periodicamente questa pagina. L'uso continuato dell'App dopo la pubblicazione delle modifiche costituisce accettazione dell'Informativa aggiornata.
        </Text>

        <Text style={styles.heading}>12. Reclami</Text>
        <Text style={styles.body}>
          L'utente che ritenga che il trattamento dei propri dati personali avvenga in violazione del GDPR ha il diritto di proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali:{'\n\n'}
          Garante per la protezione dei dati personali{'\n'}
          Piazza Venezia 11 — 00187 Roma{'\n'}
          www.garanteprivacy.it{'\n'}
          Email: protocollo@gpdp.it{'\n'}
          PEC: protocollo@pec.gpdp.it
        </Text>

        <Text style={styles.heading}>13. Contatti</Text>
        <Text style={styles.body}>
          Per qualsiasi domanda o richiesta relativa alla presente Informativa sulla Privacy:{'\n\n'}
          Steo&Davi Lab di Di Tria Stefano{'\n'}
          P.IVA: 10549650017{'\n'}
          Email: steodavilab@gmail.com
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
