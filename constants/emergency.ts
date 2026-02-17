export const emergencyNumbers = [
  { id: 'e1', label: 'Emergenza Europea', number: '112', icon: 'Phone', color: '#FF5252' },
  { id: 'e2', label: 'Contatto Ambasciata', number: '+39 06 4674 1', icon: 'Building2', color: '#7B68EE' },
  { id: 'e3', label: 'Polizia Locale', number: '113', icon: 'Shield', color: '#4DD0E1' },
  { id: 'e4', label: 'Emergenza Medica', number: '118', icon: 'Cross', color: '#FF8A80' },
];

export const emergencyByCountry: Record<string, { police: string; medical: string; fire: string; general: string }> = {
  'Italia': { police: '113', medical: '118', fire: '115', general: '112' },
  'Francia': { police: '17', medical: '15', fire: '18', general: '112' },
  'Spagna': { police: '091', medical: '061', fire: '080', general: '112' },
  'Germania': { police: '110', medical: '112', fire: '112', general: '112' },
  'Regno Unito': { police: '999', medical: '999', fire: '999', general: '999' },
  'Stati Uniti': { police: '911', medical: '911', fire: '911', general: '911' },
  'Giappone': { police: '110', medical: '119', fire: '119', general: '110' },
};
