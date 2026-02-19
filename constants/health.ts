export interface HealthInfo {
  country: string;
  flag: string;
  vaccines: { name: string; required: boolean; notes: string }[];
  medicines: string[];
  emergencyNumber: string;
  tips: string[];
}

export const healthByCountry: HealthInfo[] = [
  {
    country: 'Thailandia',
    flag: '🇹🇭',
    vaccines: [
      { name: 'Epatite A', required: true, notes: 'Consigliato per tutti i viaggiatori' },
      { name: 'Epatite B', required: false, notes: 'Per soggiorni prolungati' },
      { name: 'Febbre Tifoide', required: false, notes: 'Se si mangiano cibi di strada' },
      { name: 'Encefalite Giapponese', required: false, notes: 'Per zone rurali e soggiorni >1 mese' },
      { name: 'Rabbia', required: false, notes: 'Se a contatto con animali' },
    ],
    medicines: ['Antimalarici (zone rurali)', 'Repellente DEET 30%+', 'Reidratazione orale', 'Antidiarroici', 'Protezione solare SPF50+'],
    emergencyNumber: '1669',
    tips: ['Bevi solo acqua in bottiglia sigillata', 'Attenzione al ghiaccio nelle bevande', 'Usa repellente per zanzare al tramonto'],
  },
  {
    country: 'Brasile',
    flag: '🇧🇷',
    vaccines: [
      { name: 'Febbre Gialla', required: true, notes: 'Obbligatorio per alcune regioni' },
      { name: 'Epatite A', required: true, notes: 'Consigliato per tutti' },
      { name: 'Epatite B', required: false, notes: 'Per soggiorni prolungati' },
      { name: 'Febbre Tifoide', required: false, notes: 'Per zone rurali' },
      { name: 'Rabbia', required: false, notes: 'Se si visitano zone forestali' },
    ],
    medicines: ['Antimalarici (Amazzonia)', 'Repellente DEET 30%+', 'Protezione solare SPF50+', 'Antidiarroici', 'Kit pronto soccorso'],
    emergencyNumber: '192',
    tips: ['Vaccino febbre gialla almeno 10 giorni prima', 'Protezione zanzare h24 in Amazzonia', 'Evita acqua del rubinetto'],
  },
  {
    country: 'India',
    flag: '🇮🇳',
    vaccines: [
      { name: 'Epatite A', required: true, notes: 'Fondamentale per tutti' },
      { name: 'Epatite B', required: true, notes: 'Consigliato per tutti' },
      { name: 'Febbre Tifoide', required: true, notes: 'Altamente consigliato' },
      { name: 'Colera', required: false, notes: 'Per zone ad alto rischio' },
      { name: 'Encefalite Giapponese', required: false, notes: 'Per zone rurali' },
      { name: 'Rabbia', required: false, notes: 'Per soggiorni prolungati' },
    ],
    medicines: ['Antimalarici', 'Reidratazione orale', 'Antidiarroici (Loperamide)', 'Antibiotico ad ampio spettro', 'Repellente DEET 50%'],
    emergencyNumber: '112',
    tips: ['Mai bere acqua del rubinetto', 'Evita ghiaccio e insalate crude', 'Lava spesso le mani con disinfettante'],
  },
  {
    country: 'Kenya',
    flag: '🇰🇪',
    vaccines: [
      { name: 'Febbre Gialla', required: true, notes: 'Certificato obbligatorio' },
      { name: 'Epatite A', required: true, notes: 'Consigliato per tutti' },
      { name: 'Epatite B', required: true, notes: 'Consigliato per tutti' },
      { name: 'Febbre Tifoide', required: true, notes: 'Altamente consigliato' },
      { name: 'Meningite', required: false, notes: 'Per stagione secca' },
      { name: 'Rabbia', required: false, notes: 'Per safari e zone rurali' },
    ],
    medicines: ['Antimalarici (Malarone/Lariam)', 'Repellente DEET 50%', 'Rete antizanzare', 'Reidratazione orale', 'Antibiotico emergenza'],
    emergencyNumber: '999',
    tips: ['Profilassi antimalarica obbligatoria', 'Dormi sotto zanzariera trattata', 'Indossa maniche lunghe dopo il tramonto'],
  },
  {
    country: 'Giappone',
    flag: '🇯🇵',
    vaccines: [
      { name: 'Encefalite Giapponese', required: false, notes: 'Solo per zone rurali in estate' },
      { name: 'Epatite A', required: false, notes: 'Per precauzione' },
      { name: 'Epatite B', required: false, notes: 'Per soggiorni prolungati' },
    ],
    medicines: ['Antistaminici (allergie stagionali)', 'Cerotti per vesciche', 'Protezione solare', 'Farmaci personali con prescrizione'],
    emergencyNumber: '119',
    tips: ['Paese molto sicuro dal punto di vista sanitario', 'Farmacie ovunque ma pochi parlano inglese', 'Porta prescrizione medica per farmaci personali'],
  },
  {
    country: 'Messico',
    flag: '🇲🇽',
    vaccines: [
      { name: 'Epatite A', required: true, notes: 'Consigliato per tutti' },
      { name: 'Epatite B', required: false, notes: 'Per soggiorni prolungati' },
      { name: 'Febbre Tifoide', required: false, notes: 'Per zone rurali' },
      { name: 'Rabbia', required: false, notes: 'Se a contatto con animali' },
    ],
    medicines: ['Antidiarroici', 'Reidratazione orale', 'Repellente per zanzare', 'Protezione solare SPF50+', 'Antistaminici'],
    emergencyNumber: '911',
    tips: ['Evita acqua del rubinetto', 'Lava frutta e verdura con acqua purificata', 'Attenzione alle zanzare (Dengue)'],
  },
  {
    country: 'Egitto',
    flag: '🇪🇬',
    vaccines: [
      { name: 'Epatite A', required: true, notes: 'Consigliato per tutti' },
      { name: 'Epatite B', required: false, notes: 'Per soggiorni prolungati' },
      { name: 'Febbre Tifoide', required: false, notes: 'Per zone rurali' },
      { name: 'Rabbia', required: false, notes: 'Se a contatto con animali randagi' },
    ],
    medicines: ['Antidiarroici', 'Reidratazione orale', 'Protezione solare SPF50+', 'Collirio per polvere/sabbia', 'Disinfettante mani'],
    emergencyNumber: '123',
    tips: ['Bevi solo acqua in bottiglia', 'Evita cibi crudi nei mercati', 'Proteggiti dal sole nelle ore centrali'],
  },
  {
    country: 'Stati Uniti',
    flag: '🇺🇸',
    vaccines: [
      { name: 'Nessun vaccino obbligatorio', required: false, notes: 'Verifica copertura vaccinale standard' },
    ],
    medicines: ['Farmaci personali con prescrizione', 'Antistaminici', 'Protezione solare'],
    emergencyNumber: '911',
    tips: ['Assicurazione sanitaria INDISPENSABILE', 'Costi sanitari molto elevati', 'Porta prescrizioni mediche originali'],
  },
  {
    country: 'Spagna',
    flag: '🇪🇸',
    vaccines: [
      { name: 'Nessun vaccino obbligatorio', required: false, notes: 'Tessera sanitaria europea valida' },
    ],
    medicines: ['Protezione solare SPF50+', 'Farmaci personali', 'Cerotti e disinfettante'],
    emergencyNumber: '112',
    tips: ['Tessera sanitaria europea (TEAM) valida', 'Farmacie con croce verde ovunque', 'Attenzione ai colpi di calore in estate'],
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    vaccines: [
      { name: 'Epatite B', required: false, notes: 'Per soggiorni prolungati' },
      { name: 'Encefalite Giapponese', required: false, notes: 'Per zone tropicali del nord' },
    ],
    medicines: ['Protezione solare SPF50+', 'Repellente insetti', 'Antistaminici', 'Kit morsi/punture'],
    emergencyNumber: '000',
    tips: ['Protezione solare obbligatoria (buco ozono)', 'Attenzione fauna marina pericolosa', 'Assicurazione sanitaria consigliata'],
  },
];
