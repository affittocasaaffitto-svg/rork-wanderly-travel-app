import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import Colors from '@/constants/colors';

export default function TermsScreen() {
  return (
    <View style={styles.container}>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdate}>Ultimo aggiornamento: 19 Febbraio 2026</Text>

        <Text style={styles.heading}>1. Premessa e Identificazione del Titolare</Text>
        <Text style={styles.body}>
          L'applicazione mobile "Che Viaggiatore Sei?" (di seguito "App") è di titolarità della ditta individuale Steo&Davi Lab di Di Tria Stefano, con sede legale in Italia, Partita IVA 10549650017 (di seguito "Titolare").{'\n\n'}I presenti Termini di Servizio (di seguito "Termini") regolano l'accesso e l'utilizzo dell'App e di tutti i servizi ad essa collegati. L'utilizzo dell'App implica l'accettazione integrale e incondizionata dei presenti Termini. Qualora l'utente non intenda accettare i Termini, è pregato di non installare né utilizzare l'App.
        </Text>

        <Text style={styles.heading}>2. Descrizione del Servizio</Text>
        <Text style={styles.body}>
          L'App "Che Viaggiatore Sei?" è un'applicazione mobile gratuita progettata per assistere i viaggiatori nella pianificazione, organizzazione e gestione dei propri viaggi. I servizi includono, a titolo esemplificativo e non esaustivo:{'\n\n'}
          • Quiz interattivi sul profilo del viaggiatore{'\n'}
          • Diario di viaggio personale{'\n'}
          • Strumenti di utilità (convertitore valute, frasario, meteo, fusi orari, ecc.){'\n'}
          • Pianificazione di itinerari e viaggi{'\n'}
          • Gestione budget di viaggio{'\n'}
          • Checklist e liste di preparazione{'\n'}
          • Informazioni su destinazioni e numeri di emergenza
        </Text>

        <Text style={styles.heading}>3. Condizioni di Utilizzo</Text>
        <Text style={styles.body}>
          L'utente si impegna a:{'\n\n'}
          • Utilizzare l'App esclusivamente per scopi personali, leciti e non commerciali{'\n'}
          • Non tentare di decompilare, disassemblare, effettuare reverse engineering o altrimenti tentare di ottenere il codice sorgente dell'App{'\n'}
          • Non utilizzare l'App per scopi illegali, fraudolenti o in violazione di diritti di terzi{'\n'}
          • Non interferire con il corretto funzionamento dell'App o dei server ad essa collegati{'\n'}
          • Non caricare, trasmettere o distribuire contenuti illeciti, offensivi, diffamatori, osceni o altrimenti inappropriati{'\n'}
          • Non riprodurre, duplicare, copiare, vendere o rivendere qualsiasi parte dell'App senza autorizzazione scritta del Titolare
        </Text>

        <Text style={styles.heading}>4. Proprietà Intellettuale</Text>
        <Text style={styles.body}>
          Tutti i contenuti presenti nell'App — inclusi, a titolo esemplificativo, testi, grafica, loghi, icone, immagini, audio, video, software, codice sorgente, design e layout — sono di esclusiva proprietà di Steo&Davi Lab di Di Tria Stefano o dei rispettivi licenziatari e sono protetti dalle leggi italiane, europee e internazionali in materia di diritto d'autore, marchi, brevetti e proprietà intellettuale.{'\n\n'}È espressamente vietata qualsiasi riproduzione, distribuzione, modifica, adattamento, traduzione, pubblicazione o sfruttamento commerciale dei contenuti dell'App senza previa autorizzazione scritta del Titolare.
        </Text>

        <Text style={styles.heading}>5. Contenuti dell'Utente</Text>
        <Text style={styles.body}>
          I contenuti generati dall'utente all'interno dell'App (diari di viaggio, note, itinerari, checklist) rimangono di proprietà dell'utente. Tuttavia, l'utente concede al Titolare una licenza non esclusiva, gratuita e revocabile per archiviare, elaborare e visualizzare tali contenuti al solo fine di erogare il servizio.{'\n\n'}L'utente è l'unico responsabile dei contenuti che inserisce, carica o condivide tramite l'App. Il Titolare si riserva il diritto di rimuovere contenuti ritenuti illeciti, offensivi o in violazione dei presenti Termini.
        </Text>

        <Text style={styles.heading}>6. Pubblicità e Contenuti Sponsorizzati</Text>
        <Text style={styles.body}>
          L'App può contenere annunci pubblicitari forniti da servizi terzi (es. Google AdMob). L'utente può scegliere volontariamente di visualizzare annunci video pubblicitari (Rewarded Ads) per accedere a funzionalità o contenuti premium aggiuntivi. La visualizzazione di tali annunci è sempre facoltativa e mai automatica.{'\n\n'}Il Titolare non è responsabile per il contenuto degli annunci pubblicitari di terze parti, né per eventuali acquisti o transazioni effettuate tramite tali annunci.
        </Text>

        <Text style={styles.heading}>7. Esclusione e Limitazione di Responsabilità</Text>
        <Text style={styles.body}>
          L'App è fornita "così com'è" (as is) e "come disponibile" (as available), senza garanzie di alcun tipo, espresse o implicite, incluse, a titolo esemplificativo, garanzie di commerciabilità, idoneità per uno scopo particolare e non violazione.{'\n\n'}Il Titolare non garantisce:{'\n'}
          • Che l'App sia priva di errori, interruzioni, virus o difetti{'\n'}
          • L'accuratezza, completezza o aggiornamento delle informazioni fornite (tassi di cambio, meteo, informazioni di emergenza, ecc.){'\n'}
          • La disponibilità ininterrotta del servizio{'\n\n'}
          In nessun caso il Titolare, i suoi collaboratori o licenziatari saranno responsabili per danni diretti, indiretti, incidentali, speciali, consequenziali o punitivi (inclusi, a titolo esemplificativo, perdita di dati, mancato guadagno, interruzione dell'attività) derivanti dall'uso o dall'impossibilità di utilizzare l'App.{'\n\n'}
          Le informazioni fornite dall'App sono a scopo puramente informativo e orientativo. L'utente è tenuto a verificare sempre le informazioni critiche (numeri di emergenza, condizioni meteo, tassi di cambio) tramite fonti ufficiali e canali istituzionali prima di basare su di esse qualsiasi decisione.
        </Text>

        <Text style={styles.heading}>8. Disponibilità del Servizio</Text>
        <Text style={styles.body}>
          Il Titolare si riserva il diritto di modificare, sospendere o interrompere, temporaneamente o permanentemente, qualsiasi aspetto o funzionalità dell'App in qualsiasi momento, con o senza preavviso, senza che ciò generi alcun diritto di indennizzo o risarcimento in capo all'utente.
        </Text>

        <Text style={styles.heading}>9. Modifiche ai Termini</Text>
        <Text style={styles.body}>
          Il Titolare si riserva il diritto di modificare o aggiornare i presenti Termini in qualsiasi momento. Le modifiche saranno comunicate tramite l'App e/o all'indirizzo email fornito dall'utente. L'uso continuato dell'App dopo la pubblicazione delle modifiche costituisce accettazione dei Termini aggiornati.
        </Text>

        <Text style={styles.heading}>10. Risoluzione e Sospensione</Text>
        <Text style={styles.body}>
          Il Titolare può sospendere o terminare l'accesso dell'utente all'App in qualsiasi momento, senza preavviso, in caso di violazione dei presenti Termini o di comportamenti ritenuti lesivi per il servizio o per altri utenti. In caso di risoluzione, il diritto dell'utente di utilizzare l'App cesserà immediatamente.
        </Text>

        <Text style={styles.heading}>11. Legge Applicabile e Foro Competente</Text>
        <Text style={styles.body}>
          I presenti Termini di Servizio sono regolati e interpretati in conformità con la legge italiana. Per qualsiasi controversia derivante dall'interpretazione, validità o esecuzione dei presenti Termini, nonché dall'uso dell'App, sarà competente in via esclusiva il Foro di Torino, Italia, salvo diverso foro inderogabile previsto dalla legge a tutela del consumatore ai sensi del D.Lgs. 206/2005 (Codice del Consumo).
        </Text>

        <Text style={styles.heading}>12. Disposizioni Finali</Text>
        <Text style={styles.body}>
          Qualora una o più clausole dei presenti Termini risultino invalide, nulle o inapplicabili, ciò non pregiudicherà la validità e l'efficacia delle restanti clausole.{'\n\n'}La mancata applicazione da parte del Titolare di un diritto o di una disposizione dei presenti Termini non costituisce rinuncia a tale diritto o disposizione.
        </Text>

        <Text style={styles.heading}>13. Contatti</Text>
        <Text style={styles.body}>
          Per domande, segnalazioni o chiarimenti sui presenti Termini di Servizio, è possibile contattare:{'\n\n'}
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
