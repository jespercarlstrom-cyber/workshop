import type { MaintenanceItem, Parameters } from "./models";

// ---------------------------------------------------------------------------
// Default parameters
// ---------------------------------------------------------------------------

export const DEFAULT_PARAMETERS: Parameters = {
  forvantadInflation: 2.0,
  forvantadNominellRanta: 5.0,
};

// ---------------------------------------------------------------------------
// Example maintenance items (pre-populated template)
// ---------------------------------------------------------------------------

export const EXAMPLE_MAINTENANCE_ITEMS: MaintenanceItem[] = [
  { beskrivning: "Tak", senastUtfort: 2010, kostnadDa: 500000, intervall: 30 },
  {
    beskrivning: "Fasad",
    senastUtfort: 2015,
    kostnadDa: 800000,
    intervall: 40,
  },
  {
    beskrivning: "Stammar (VVS)",
    senastUtfort: 2000,
    kostnadDa: 1200000,
    intervall: 50,
  },
  {
    beskrivning: "Fönster",
    senastUtfort: 2005,
    kostnadDa: 300000,
    intervall: 30,
  },
  {
    beskrivning: "Hiss",
    senastUtfort: 2012,
    kostnadDa: 400000,
    intervall: 25,
  },
  {
    beskrivning: "Tvättstuga",
    senastUtfort: 2018,
    kostnadDa: 150000,
    intervall: 15,
  },
];

// ---------------------------------------------------------------------------
// Step labels (Swedish)
// ---------------------------------------------------------------------------

export const STEPS = [
  { path: "/analys/steg-1", label: "Fastighet", short: "1" },
  { path: "/analys/steg-2", label: "Balansräkning", short: "2" },
  { path: "/analys/steg-3", label: "Resultaträkning", short: "3" },
  { path: "/analys/steg-4", label: "Underhållsplan", short: "4" },
  { path: "/analys/resultat", label: "Resultat", short: "5" },
] as const;

// ---------------------------------------------------------------------------
// KPIF fallback table (December values, 1987=100)
// Updated periodically — used if SCB API is unavailable
// ---------------------------------------------------------------------------

export const KPIF_FALLBACK: [number, number][] = [
  [1987, 100.0],
  [1990, 120.6],
  [1995, 133.5],
  [2000, 140.5],
  [2005, 150.3],
  [2010, 165.2],
  [2011, 167.0],
  [2012, 168.0],
  [2013, 168.5],
  [2014, 170.1],
  [2015, 172.6],
  [2016, 175.4],
  [2017, 178.9],
  [2018, 182.7],
  [2019, 186.0],
  [2020, 187.6],
  [2021, 194.3],
  [2022, 209.9],
  [2023, 217.3],
  [2024, 221.5],
  [2025, 225.0],
];

// ---------------------------------------------------------------------------
// Field help texts (tooltips)
// ---------------------------------------------------------------------------

export const HELP_TEXTS: Record<string, string> = {
  kommun: "Den kommun där fastigheten ligger.",
  fastighetsbeteckning:
    "Fastighetens officiella beteckning, t.ex. 'Stockholm Södermalm 1:23'.",
  bta: "Bruttototalarea (BTA) i kvadratmeter. Hittas i årsredovisningen eller hos Lantmäteriet.",
  totalBostadsyta:
    "Total bostadsyta (BOA) för BRF-ägda lägenheter i kvadratmeter.",
  vardeHyreslagenheter:
    "Om föreningen har hyresrätter som kan omvandlas, ange deras uppskattade marknadsvärde. Annars 0.",
  arTomtratt:
    "Välj ja om föreningen har tomträtt (arrenderar marken av kommunen).",
  tomtrattBundenTill:
    "Vilket år den nuvarande tomträttsavgälden löper ut.",
  tomtrattArligAvgald:
    "Nuvarande årlig tomträttsavgäld i kronor.",
  taxeringsvardeMark:
    "Taxeringsvärde för marken per kvm BTA. Hittas hos Skatteverket.",
  kassaBank: "Kassa och bank från balansräkningen.",
  forutbetaldaKostnader: "Förutbetalda kostnader och upplupna intäkter.",
  ovrigaOmsattningstillgangar: "Övriga omsättningstillgångar.",
  banklan: "Banklån och andra långfristiga skulder.",
  upplupenKostnader: "Upplupna kostnader och förutbetalda intäkter.",
  ovrigaKortfristigaSkulder: "Övriga kortfristiga skulder.",
  arsresultat: "Årets resultat efter skatt.",
  medlemsavgifter: "Totala årsavgifter från medlemmarna (alla lägenheter).",
  avskrivningar: "Årets avskrivningar på byggnader och inventarier.",
  planeradeUnderhallsutgifter:
    "Kostnader för planerat underhåll som bokförts under året.",
  tomtrattskostnad: "Årets kostnad för tomträttsavgäld (0 om inte tomträtt).",
  rantenetto:
    "Netto av räntekostnader minus ränteintäkter. Positivt = nettokostnad.",
  forvantadInflation:
    "Förväntad långsiktig inflation. Riksbankens mål är 2%.",
  forvantadNominellRanta:
    "Förväntad långsiktig nominell ränta på föreningens lån.",
};
