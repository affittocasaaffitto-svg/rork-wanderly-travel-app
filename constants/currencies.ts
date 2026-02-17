import { CurrencyRate } from '@/types';

export const currencies: CurrencyRate[] = [
  { code: 'EUR', name: 'Euro', rate: 1.0, flag: '🇪🇺' },
  { code: 'USD', name: 'Dollaro Statunitense', rate: 1.08, flag: '🇺🇸' },
  { code: 'GBP', name: 'Sterlina Britannica', rate: 0.85, flag: '🇬🇧' },
  { code: 'JPY', name: 'Yen Giapponese', rate: 158.5, flag: '🇯🇵' },
  { code: 'CHF', name: 'Franco Svizzero', rate: 0.95, flag: '🇨🇭' },
  { code: 'AUD', name: 'Dollaro Australiano', rate: 1.65, flag: '🇦🇺' },
  { code: 'CAD', name: 'Dollaro Canadese', rate: 1.47, flag: '🇨🇦' },
  { code: 'THB', name: 'Baht Thailandese', rate: 37.8, flag: '🇹🇭' },
];
