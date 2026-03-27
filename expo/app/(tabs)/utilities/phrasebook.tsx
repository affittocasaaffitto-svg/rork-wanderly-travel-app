import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Search, Star, Volume2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { phrases as allPhrases } from '@/constants/phrases';
import { useAppState } from '@/hooks/useAppState';

const categories = ['Base', 'Ristorante', 'Shopping', 'Emergenza', 'Trasporti'];
const borderColors = [Colors.teal, Colors.purple, Colors.coral];

export default function PhrasebookScreen() {
  const { phrasesFavorites, togglePhraseFavorite } = useAppState();
  const [activeCategory, setActiveCategory] = useState('Base');
  const [searchText, setSearchText] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredPhrases = useMemo(() => {
    let result = allPhrases.filter(p => p.category === activeCategory);
    if (showFavoritesOnly) {
      result = allPhrases.filter(p => phrasesFavorites.includes(p.id));
    }
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      result = result.filter(
        p =>
          p.italian.toLowerCase().includes(query) ||
          p.english.toLowerCase().includes(query)
      );
    }
    return result;
  }, [activeCategory, searchText, showFavoritesOnly, phrasesFavorites]);

  const handleFavorite = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    togglePhraseFavorite(id);
  }, [togglePhraseFavorite]);

  const handleSpeak = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search color={Colors.textLight} size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca frase..."
          placeholderTextColor={Colors.textLight}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
        <TouchableOpacity
          style={[styles.pill, showFavoritesOnly && styles.pillFav]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Star color={showFavoritesOnly ? Colors.white : Colors.coral} size={14} fill={showFavoritesOnly ? Colors.white : 'transparent'} />
          <Text style={[styles.pillText, showFavoritesOnly && styles.pillTextFav]}>Preferiti</Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.pill,
              !showFavoritesOnly && activeCategory === cat && styles.pillActive,
            ]}
            onPress={() => {
              setShowFavoritesOnly(false);
              setActiveCategory(cat);
            }}
          >
            <Text
              style={[
                styles.pillText,
                !showFavoritesOnly && activeCategory === cat && styles.pillTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.phraseList}>
        {filteredPhrases.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {showFavoritesOnly ? 'Nessun preferito ancora' : 'Nessun risultato'}
            </Text>
          </View>
        )}
        {filteredPhrases.map((phrase, index) => {
          const isFav = phrasesFavorites.includes(phrase.id);
          return (
            <View
              key={phrase.id}
              style={[styles.phraseCard, { borderLeftColor: borderColors[index % 3] }]}
            >
              <View style={styles.phraseContent}>
                <Text style={styles.phraseItalian}>{phrase.italian}</Text>
                <Text style={styles.phraseEnglish}>{phrase.english}</Text>
                <Text style={styles.phrasePhonetic}>{phrase.phonetic}</Text>
              </View>
              <View style={styles.phraseActions}>
                <TouchableOpacity onPress={handleSpeak} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Volume2 color={Colors.teal} size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFavorite(phrase.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Star
                    color={isFav ? Colors.coral : Colors.textLight}
                    size={20}
                    fill={isFav ? Colors.coral : 'transparent'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  pillRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 56,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
  },
  pillFav: {
    backgroundColor: Colors.coral,
    borderColor: Colors.coral,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
  },
  pillTextFav: {
    color: Colors.white,
  },
  phraseList: {
    paddingHorizontal: 16,
  },
  phraseCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  phraseContent: {
    flex: 1,
  },
  phraseItalian: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  phraseEnglish: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  phrasePhonetic: {
    fontSize: 13,
    fontStyle: 'italic' as const,
    color: Colors.textLight,
  },
  phraseActions: {
    justifyContent: 'center',
    gap: 16,
    paddingLeft: 12,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textLight,
  },
});
