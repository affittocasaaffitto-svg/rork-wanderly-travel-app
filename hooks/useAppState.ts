import { useState, useEffect, useCallback } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { TravelerProfile, ChecklistItem, Trip, Phrase, DiaryEntry, TripStatus } from '@/types';
import { defaultChecklist } from '@/constants/checklist';
import { phrases as defaultPhrases } from '@/constants/phrases';

const STORAGE_KEYS = {
  profile: 'wanderly_profile',
  checklist: 'wanderly_checklist',
  trips: 'wanderly_trips',
  phrases: 'wanderly_phrases',
  onboarded: 'wanderly_onboarded',
  quizAnswers: 'wanderly_quiz_answers',
  diary: 'wanderly_diary',
};

export const [AppStateProvider, useAppState] = createContextHook(() => {
  const [profile, setProfile] = useState<TravelerProfile | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [phrasesFavorites, setPhrasesFavorites] = useState<string[]>([]);
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);

  const loadQuery = useQuery({
    queryKey: ['appState'],
    queryFn: async () => {
      const [profileData, checklistData, tripsData, phrasesData, onboardedData, quizData, diaryData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.profile),
        AsyncStorage.getItem(STORAGE_KEYS.checklist),
        AsyncStorage.getItem(STORAGE_KEYS.trips),
        AsyncStorage.getItem(STORAGE_KEYS.phrases),
        AsyncStorage.getItem(STORAGE_KEYS.onboarded),
        AsyncStorage.getItem(STORAGE_KEYS.quizAnswers),
        AsyncStorage.getItem(STORAGE_KEYS.diary),
      ]);
      return {
        profile: profileData ? (JSON.parse(profileData) as TravelerProfile) : null,
        checklist: checklistData ? (JSON.parse(checklistData) as ChecklistItem[]) : defaultChecklist,
        trips: tripsData ? (JSON.parse(tripsData) as Trip[]) : [],
        phrasesFavorites: phrasesData ? (JSON.parse(phrasesData) as string[]) : [],
        onboarded: onboardedData === 'true',
        quizAnswers: quizData ? (JSON.parse(quizData) as string[]) : [],
        diary: diaryData ? (JSON.parse(diaryData) as DiaryEntry[]) : [],
      };
    },
  });

  useEffect(() => {
    if (loadQuery.data) {
      setProfile(loadQuery.data.profile);
      setChecklist(loadQuery.data.checklist);
      setTrips(loadQuery.data.trips);
      setPhrasesFavorites(loadQuery.data.phrasesFavorites);
      setOnboarded(loadQuery.data.onboarded);
      setQuizAnswers(loadQuery.data.quizAnswers);
      setDiary(loadQuery.data.diary);
    }
  }, [loadQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await AsyncStorage.setItem(key, value);
    },
  });

  const updateProfile = useCallback((p: TravelerProfile | null) => {
    setProfile(p);
    saveMutation.mutate({ key: STORAGE_KEYS.profile, value: JSON.stringify(p) });
  }, []);

  const updateChecklist = useCallback((items: ChecklistItem[]) => {
    setChecklist(items);
    saveMutation.mutate({ key: STORAGE_KEYS.checklist, value: JSON.stringify(items) });
  }, []);

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklist(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
      saveMutation.mutate({ key: STORAGE_KEYS.checklist, value: JSON.stringify(updated) });
      return updated;
    });
  }, []);

  const addChecklistItem = useCallback((item: ChecklistItem) => {
    setChecklist(prev => {
      const updated = [...prev, item];
      saveMutation.mutate({ key: STORAGE_KEYS.checklist, value: JSON.stringify(updated) });
      return updated;
    });
  }, []);

  const addTrip = useCallback((trip: Trip) => {
    setTrips(prev => {
      const updated = [...prev, trip];
      saveMutation.mutate({ key: STORAGE_KEYS.trips, value: JSON.stringify(updated) });
      return updated;
    });
  }, []);

  const removeTrip = useCallback((id: string) => {
    setTrips(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveMutation.mutate({ key: STORAGE_KEYS.trips, value: JSON.stringify(updated) });
      return updated;
    });
  }, []);

  const updateTrip = useCallback((id: string, updates: Partial<Trip>) => {
    setTrips(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      saveMutation.mutate({ key: STORAGE_KEYS.trips, value: JSON.stringify(updated) });
      return updated;
    });
  }, []);

  const togglePhraseFavorite = useCallback((id: string) => {
    setPhrasesFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      saveMutation.mutate({ key: STORAGE_KEYS.phrases, value: JSON.stringify(updated) });
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboarded(true);
    saveMutation.mutate({ key: STORAGE_KEYS.onboarded, value: 'true' });
  }, []);

  const saveQuizAnswers = useCallback((answers: string[]) => {
    setQuizAnswers(answers);
    saveMutation.mutate({ key: STORAGE_KEYS.quizAnswers, value: JSON.stringify(answers) });
  }, []);

  const addDiaryEntry = useCallback((entry: DiaryEntry) => {
    setDiary(prev => {
      const updated = [entry, ...prev];
      saveMutation.mutate({ key: STORAGE_KEYS.diary, value: JSON.stringify(updated) });
      return updated;
    });
  }, []);

  const removeDiaryEntry = useCallback((id: string) => {
    setDiary(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveMutation.mutate({ key: STORAGE_KEYS.diary, value: JSON.stringify(updated) });
      return updated;
    });
  }, []);

  const updateDiaryEntry = useCallback((id: string, updates: Partial<DiaryEntry>) => {
    setDiary(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...updates } : e);
      saveMutation.mutate({ key: STORAGE_KEYS.diary, value: JSON.stringify(updated) });
      return updated;
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setProfile(null);
    setQuizAnswers([]);
    saveMutation.mutate({ key: STORAGE_KEYS.profile, value: JSON.stringify(null) });
    saveMutation.mutate({ key: STORAGE_KEYS.quizAnswers, value: JSON.stringify([]) });
  }, []);

  return {
    profile,
    checklist,
    trips,
    diary,
    phrasesFavorites,
    onboarded,
    quizAnswers,
    isLoading: loadQuery.isLoading,
    updateProfile,
    updateChecklist,
    toggleChecklistItem,
    addChecklistItem,
    addTrip,
    removeTrip,
    updateTrip,
    togglePhraseFavorite,
    completeOnboarding,
    saveQuizAnswers,
    addDiaryEntry,
    removeDiaryEntry,
    updateDiaryEntry,
    resetQuiz,
  };
});
