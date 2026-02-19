import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

import { ChevronDown, ChevronUp, Mail, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Come posso creare un nuovo viaggio?',
    answer: 'Vai nella sezione "Viaggi" dalla barra di navigazione in basso, poi tocca il pulsante "+" per aggiungere un nuovo viaggio. Inserisci la destinazione, le date e i dettagli del viaggio.',
  },
  {
    question: 'Come funziona il diario di viaggio?',
    answer: 'Il diario ti permette di annotare le tue esperienze giorno per giorno. Puoi aggiungere testi, emozioni e valutazioni per ogni giornata del viaggio. Accedi dalla sezione Home e seleziona "Diario".',
  },
  {
    question: 'Come funziona il quiz "Che Viaggiatore Sei?"',
    answer: 'Dalla Home, tocca "Fai il Quiz" per rispondere a una serie di domande sulle tue preferenze di viaggio. Al termine scoprirai il tuo profilo di viaggiatore con una descrizione personalizzata e destinazioni consigliate.',
  },
  {
    question: 'Posso usare l\'app senza connessione internet?',
    answer: 'Sì! Molte funzionalità sono disponibili offline: diario di viaggio, checklist, frasario, quiz e pianificazione. Alcune funzioni come il meteo, il convertitore valute in tempo reale e il traduttore richiedono una connessione internet.',
  },
  {
    question: 'Come funzionano i video pubblicitari (Rewarded Ads)?',
    answer: 'In alcune sezioni dell\'app puoi scegliere volontariamente di guardare un breve video pubblicitario per sbloccare contenuti premium aggiuntivi. La visualizzazione è sempre facoltativa e mai automatica. Non sarai mai interrotto da pubblicità non richieste.',
  },
  {
    question: 'Come funziona il convertitore di valute?',
    answer: 'Il convertitore di valute si trova nella sezione "Utilità". Seleziona la valuta di partenza e quella di destinazione, inserisci l\'importo e otterrai la conversione. I tassi di cambio vengono aggiornati regolarmente.',
  },
  {
    question: 'Come posso cambiare la lingua dell\'app?',
    answer: 'Vai nella sezione "Profilo", tocca "Lingua" nelle impostazioni account e seleziona la lingua desiderata tra quelle disponibili.',
  },
  {
    question: 'I miei dati sono al sicuro?',
    answer: 'Sì! I tuoi dati (diario, viaggi, quiz) sono salvati localmente sul tuo dispositivo. Non raccogliamo né trasmettiamo i tuoi contenuti personali ai nostri server. Consulta la nostra Privacy Policy per tutti i dettagli sul trattamento dei dati.',
  },
  {
    question: 'Come posso eliminare i miei dati?',
    answer: 'Poiché i dati sono salvati localmente sul tuo dispositivo, puoi eliminarli disinstallando l\'app. Per richieste specifiche relative ai tuoi dati personali (diritto alla cancellazione ai sensi del GDPR), contattaci a steodavilab@gmail.com.',
  },
  {
    question: 'L\'app è gratuita?',
    answer: 'Sì, "Che Viaggiatore Sei?" è completamente gratuita. L\'app si sostiene tramite annunci pubblicitari opzionali (Rewarded Ads) che l\'utente può scegliere volontariamente di visualizzare.',
  },
];

export default function HelpScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.contactCard}
          activeOpacity={0.8}
          onPress={() => Linking.openURL('mailto:steodavilab@gmail.com?subject=Assistenza%20Che%20Viaggiatore%20Sei')}
        >
          <View style={[styles.contactIcon, { backgroundColor: Colors.tealLight }]}>
            <Mail color={Colors.tealDark} size={22} />
          </View>
          <View style={styles.contactTextWrap}>
            <Text style={styles.contactLabel}>Contattaci via Email</Text>
            <Text style={styles.contactSub}>steodavilab@gmail.com</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.guideCard}>
          <BookOpen color={Colors.tealDark} size={20} />
          <View style={styles.guideText}>
            <Text style={styles.guideTitle}>Guida Rapida</Text>
            <Text style={styles.guideSub}>
              Esplora le sezioni dell'app: Home per i suggerimenti e il quiz, Utilità per gli strumenti da viaggio, Viaggi per pianificare i tuoi itinerari e Profilo per le impostazioni. In ogni sezione Utilità puoi sbloccare contenuti extra guardando un breve video.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Domande Frequenti</Text>

        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            activeOpacity={0.8}
            onPress={() => toggleFaq(index)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              {openIndex === index ? (
                <ChevronUp color={Colors.tealDark} size={20} />
              ) : (
                <ChevronDown color={Colors.textLight} size={20} />
              )}
            </View>
            {openIndex === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.bottomNote}>
          <Text style={styles.bottomNoteText}>
            Non hai trovato la risposta?{'\n'}Scrivici a steodavilab@gmail.com e ti risponderemo il prima possibile!
          </Text>
        </View>

        <Text style={styles.footerText}>
          Steo&Davi Lab di Di Tria Stefano{'\n'}P.IVA: 10549650017
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
  content: {
    padding: 16,
  },
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextWrap: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  contactSub: {
    fontSize: 13,
    color: Colors.textLight,
  },
  guideCard: {
    backgroundColor: Colors.tealLight,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  guideText: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.tealDark,
    marginBottom: 4,
  },
  guideSub: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  faqItem: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 21,
    color: Colors.textSecondary,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  bottomNote: {
    backgroundColor: Colors.purpleLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  bottomNoteText: {
    fontSize: 14,
    color: Colors.purpleDark,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 16,
    lineHeight: 18,
  },
});
