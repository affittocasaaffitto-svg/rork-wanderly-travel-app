import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { ChevronDown, ChevronUp, MessageCircle, Mail, BookOpen } from 'lucide-react-native';
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
    answer: 'Il diario ti permette di annotare le tue esperienze giorno per giorno. Puoi aggiungere testi, emozioni e valutazioni per ogni giornata del viaggio. Accedi dalla sezione "Viaggi" e seleziona il viaggio desiderato.',
  },
  {
    question: 'Posso usare l\'app senza connessione internet?',
    answer: 'Molte funzionalità sono disponibili offline, come il diario di viaggio, la checklist e il frasario. Alcune funzioni come il meteo, il convertitore valute in tempo reale e il traduttore richiedono una connessione internet.',
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
    answer: 'Sì, la sicurezza dei tuoi dati è la nostra priorità. Utilizziamo crittografia avanzata e rispettiamo pienamente il GDPR. Puoi consultare la nostra Privacy Policy per maggiori dettagli.',
  },
  {
    question: 'Come posso eliminare il mio account?',
    answer: 'Vai in "Profilo" > "Modifica Profilo" e scorri fino in fondo per trovare l\'opzione di eliminazione account. In alternativa, puoi contattarci a privacy@wanderlyapp.com per richiedere la cancellazione.',
  },
  {
    question: 'L\'app è gratuita?',
    answer: 'Wanderly è gratuita con tutte le funzionalità base. Alcune funzionalità premium potrebbero essere disponibili in futuro tramite abbonamento.',
  },
];

export default function HelpScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Centro Assistenza', headerShown: true, headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.textPrimary }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contactCards}>
          <TouchableOpacity style={styles.contactCard} activeOpacity={0.8} onPress={() => Linking.openURL('mailto:support@wanderlyapp.com')}>
            <View style={[styles.contactIcon, { backgroundColor: Colors.tealLight }]}>
              <Mail color={Colors.tealDark} size={22} />
            </View>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactSub}>support@wanderlyapp.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactCard} activeOpacity={0.8}>
            <View style={[styles.contactIcon, { backgroundColor: Colors.purpleLight }]}>
              <MessageCircle color={Colors.purpleDark} size={22} />
            </View>
            <Text style={styles.contactLabel}>Chat</Text>
            <Text style={styles.contactSub}>Rispondiamo in 24h</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guideCard}>
          <BookOpen color={Colors.tealDark} size={20} />
          <View style={styles.guideText}>
            <Text style={styles.guideTitle}>Guida Rapida</Text>
            <Text style={styles.guideSub}>Esplora le sezioni dell'app: Home per i suggerimenti, Utilità per gli strumenti, Viaggi per pianificare e Profilo per le impostazioni.</Text>
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
            Non hai trovato la risposta?{'\n'}Contattaci e ti risponderemo il prima possibile!
          </Text>
        </View>

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
  contactCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  contactSub: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
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
});
