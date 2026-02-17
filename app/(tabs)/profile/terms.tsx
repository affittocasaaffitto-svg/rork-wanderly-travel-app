import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Termini di Servizio', headerShown: true, headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.textPrimary }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdate}>Ultimo aggiornamento: 15 Febbraio 2026</Text>

        <Text style={styles.heading}>1. Accettazione dei Termini</Text>
        <Text style={styles.body}>
          Benvenuto su Wanderly Travel App. Utilizzando la nostra applicazione, accetti di essere vincolato dai presenti Termini di Servizio. Se non accetti questi termini, ti preghiamo di non utilizzare l'applicazione. L'uso continuato dell'app dopo eventuali modifiche ai termini costituisce accettazione delle modifiche stesse.
        </Text>

        <Text style={styles.heading}>2. Descrizione del Servizio</Text>
        <Text style={styles.body}>
          Wanderly Travel App è un'applicazione mobile progettata per assistere i viaggiatori nella pianificazione, organizzazione e gestione dei propri viaggi. I servizi includono, a titolo esemplificativo e non esaustivo:{'\n\n'}
          • Pianificazione di itinerari e viaggi{'\n'}
          • Diario di viaggio personale{'\n'}
          • Strumenti di utilità per viaggiatori (convertitore valute, frasario, meteo, ecc.){'\n'}
          • Quiz sul profilo del viaggiatore{'\n'}
          • Gestione budget di viaggio{'\n'}
          • Checklist e liste di preparazione
        </Text>

        <Text style={styles.heading}>3. Registrazione e Account</Text>
        <Text style={styles.body}>
          Per utilizzare alcune funzionalità dell'app potrebbe essere necessario creare un account. Sei responsabile della riservatezza delle credenziali di accesso e di tutte le attività svolte tramite il tuo account. Ti impegni a fornire informazioni accurate e aggiornate durante la registrazione e a notificarci immediatamente qualsiasi uso non autorizzato del tuo account.
        </Text>

        <Text style={styles.heading}>4. Utilizzo Accettabile</Text>
        <Text style={styles.body}>
          Accetti di utilizzare Wanderly Travel App esclusivamente per scopi leciti e in conformità con le leggi vigenti. È vietato:{'\n\n'}
          • Utilizzare l'app per scopi illegali o non autorizzati{'\n'}
          • Tentare di accedere a sistemi o dati non autorizzati{'\n'}
          • Interferire con il funzionamento dell'app o dei server{'\n'}
          • Caricare contenuti offensivi, diffamatori o illeciti{'\n'}
          • Riprodurre, duplicare o rivendere qualsiasi parte del servizio
        </Text>

        <Text style={styles.heading}>5. Proprietà Intellettuale</Text>
        <Text style={styles.body}>
          Tutti i contenuti presenti nell'app, inclusi testi, grafica, loghi, icone, immagini, software e qualsiasi altro materiale, sono di proprietà di Wanderly o dei suoi licenziatari e sono protetti dalle leggi italiane e internazionali sul diritto d'autore e sulla proprietà intellettuale. È vietata la riproduzione, distribuzione o modifica di qualsiasi contenuto senza autorizzazione scritta.
        </Text>

        <Text style={styles.heading}>6. Contenuti dell'Utente</Text>
        <Text style={styles.body}>
          I contenuti che crei all'interno dell'app (diari di viaggio, note, foto, itinerari) rimangono di tua proprietà. Tuttavia, concedi a Wanderly una licenza non esclusiva per archiviare e visualizzare tali contenuti al fine di fornirti il servizio. Sei l'unico responsabile dei contenuti che carichi o condividi tramite l'app.
        </Text>

        <Text style={styles.heading}>7. Limitazione di Responsabilità</Text>
        <Text style={styles.body}>
          Wanderly Travel App è fornita "così com'è" e "come disponibile". Non garantiamo che l'app sia priva di errori, interruzioni o difetti. In nessun caso Wanderly sarà responsabile per danni diretti, indiretti, incidentali, speciali o consequenziali derivanti dall'uso o dall'impossibilità di utilizzare l'app.{'\n\n'}
          Le informazioni fornite dall'app (meteo, tassi di cambio, informazioni di emergenza) sono a scopo informativo e potrebbero non essere sempre aggiornate o accurate. Ti consigliamo di verificare sempre le informazioni critiche tramite fonti ufficiali.
        </Text>

        <Text style={styles.heading}>8. Modifiche al Servizio</Text>
        <Text style={styles.body}>
          Ci riserviamo il diritto di modificare, sospendere o interrompere qualsiasi aspetto del servizio in qualsiasi momento, con o senza preavviso. Non saremo responsabili nei tuoi confronti o nei confronti di terzi per eventuali modifiche, sospensioni o interruzioni del servizio.
        </Text>

        <Text style={styles.heading}>9. Risoluzione</Text>
        <Text style={styles.body}>
          Possiamo sospendere o terminare il tuo accesso all'app in qualsiasi momento, senza preavviso, in caso di violazione di questi termini. In caso di risoluzione, il tuo diritto di utilizzare l'app cesserà immediatamente.
        </Text>

        <Text style={styles.heading}>10. Legge Applicabile</Text>
        <Text style={styles.body}>
          I presenti Termini di Servizio sono regolati dalla legge italiana. Per qualsiasi controversia derivante dall'uso dell'app sarà competente il Foro di Roma, Italia.
        </Text>

        <Text style={styles.heading}>11. Contatti</Text>
        <Text style={styles.body}>
          Per domande o chiarimenti sui presenti Termini di Servizio, puoi contattarci all'indirizzo:{'\n\n'}
          Email: legal@wanderlyapp.com{'\n'}
          Indirizzo: Via dei Viaggiatori 42, 00100 Roma, Italia
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
    marginBottom: 20,
    fontStyle: 'italic' as const,
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
});
