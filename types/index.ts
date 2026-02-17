export type TravelerProfile =
  | 'beach_lover'
  | 'mountain_explorer'
  | 'city_wanderer'
  | 'adventure_seeker'
  | 'luxury_traveler'
  | 'budget_backpacker';

export interface QuizOption {
  id: string;
  text: string;
  icon: string;
  profiles: TravelerProfile[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  image: string;
  gallery: string[];
  reasons: string[];
  bestSeason: string;
  budget: string;
  budgetLabel: string;
  profiles: TravelerProfile[];
}

export interface ProfileResult {
  type: TravelerProfile;
  title: string;
  icon: string;
  description: string;
  color: string;
  image: string;
  motto: string;
  strengths: string[];
  idealCompanion: string;
  mustHaveItems: string[];
  spiritAnimal: string;
  travelStyle: string;
  favoriteFood: string;
  soundtrack: string;
  stats: { label: string; value: number }[];
}

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface Phrase {
  id: string;
  italian: string;
  english: string;
  phonetic: string;
  category: string;
  favorite: boolean;
}

export type TripStatus = 'planned' | 'ongoing' | 'completed';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  image: string;
  notes: string;
  status: TripStatus;
  activities: string[];
  budget: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface WeatherCity {
  id: string;
  name: string;
  country: string;
  temp: number;
  feelsLike: number;
  high: number;
  low: number;
  condition: string;
  humidity: number;
  wind: number;
  windDir: string;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: DayForecast[];
}

export interface DayForecast {
  day: string;
  temp: number;
  condition: string;
}

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  flag: string;
}

export interface DiaryEntry {
  id: string;
  tripName: string;
  location: string;
  date: string;
  mood: 'amazing' | 'good' | 'okay' | 'bad';
  text: string;
  photos: string[];
}
