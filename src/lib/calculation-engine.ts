import type {
  AnalysisInput,
  BalanceSheet,
  CalculationResult,
  IncomeStatement,
  MaintenanceItem,
  MaintenanceItemResult,
  LandLeaseProjection,
} from "./models";
import { calculateRecommendation } from "./recommendation";

// ---------------------------------------------------------------------------
// Fisher Equation — derive real interest rate
// ---------------------------------------------------------------------------

export function calculateRealInterestRate(
  nominalRate: number,
  inflation: number
): number {
  return ((1 + nominalRate / 100) / (1 + inflation / 100) - 1) * 100;
}

// ---------------------------------------------------------------------------
// KPIF — inflate historical cost to today's money
// ---------------------------------------------------------------------------

export function inflateToToday(
  historicalCost: number,
  yearPerformed: number,
  kpifIndex: Map<number, number>
): number {
  const currentYear = new Date().getFullYear();
  const indexThen = kpifIndex.get(yearPerformed);
  const indexNow = kpifIndex.get(currentYear) ?? kpifIndex.get(currentYear - 1);

  if (!indexThen || !indexNow) {
    const years = currentYear - yearPerformed;
    return historicalCost * Math.pow(1.02, years);
  }

  return historicalCost * (indexNow / indexThen);
}

// ---------------------------------------------------------------------------
// Maintenance annuity per item
// ---------------------------------------------------------------------------

export function calculateMaintenanceItem(
  item: MaintenanceItem,
  realRate: number,
  kpifIndex: Map<number, number>
): MaintenanceItemResult {
  const currentYear = new Date().getFullYear();
  const r = realRate / 100;

  // Step 1: inflate historical cost
  const kostnadIdagspengar = inflateToToday(
    item.kostnadDa,
    item.senastUtfort,
    kpifIndex
  );

  // Step 2: annuity over interval
  const n = item.intervall;
  let annuitet: number;
  if (r === 0) {
    annuitet = kostnadIdagspengar / n;
  } else {
    annuitet = (kostnadIdagspengar * r) / (1 - Math.pow(1 + r, -n));
  }

  // Step 3: years until next occurrence
  const arTillNasta = item.senastUtfort + item.intervall - currentYear;

  // Step 4: interest component = annuity - straight-line
  const straightLine = kostnadIdagspengar / n;
  const rantekomponent = annuitet - straightLine;

  return {
    beskrivning: item.beskrivning,
    kostnadIdagspengar,
    annuitet,
    arTillNasta,
    rantekomponent,
  };
}

// ---------------------------------------------------------------------------
// Net assets
// ---------------------------------------------------------------------------

export function calculateNetAssets(
  bs: BalanceSheet,
  vardeHyreslagenheter: number
): number {
  const totalAssets =
    bs.kassaBank + bs.forutbetaldaKostnader + bs.ovrigaOmsattningstillgangar;
  const totalLiabilities =
    bs.banklan + bs.upplupenKostnader + bs.ovrigaKortfristigaSkulder;
  return totalAssets - totalLiabilities + vardeHyreslagenheter;
}

// ---------------------------------------------------------------------------
// Long-term interest costs
// ---------------------------------------------------------------------------

export function calculateLongTermInterest(
  netAssets: number,
  realRate: number,
  maintenanceItems: MaintenanceItemResult[]
): number {
  const r = realRate / 100;
  const maintenanceInterest = maintenanceItems.reduce(
    (sum, item) => sum + item.rantekomponent,
    0
  );
  return netAssets * r + maintenanceInterest;
}

// ---------------------------------------------------------------------------
// Land lease projection (SOU 2012:71)
// ---------------------------------------------------------------------------

export function calculateLandLeaseProjection(
  bta: number,
  taxeringsvardeMark: number
): LandLeaseProjection {
  const marknadsvarde = (bta * taxeringsvardeMark) / 0.75;
  const avgaldsunderlag = 0.4 * marknadsvarde;
  const arligAvgald = 0.0275 * avgaldsunderlag;

  return { marknadsvarde, avgaldsunderlag, arligAvgald };
}

// ---------------------------------------------------------------------------
// Long-term result (surplus/deficit)
// ---------------------------------------------------------------------------

export function calculateLongTermResult(
  is: IncomeStatement,
  totalMaintenanceAnnuity: number,
  longTermInterest: number,
  landLeaseProjected: number | null
): number {
  let result = is.arsresultat;

  // Add back items we replace with long-term equivalents
  result += is.avskrivningar;
  result += is.planeradeUnderhallsutgifter;
  result += is.tomtrattskostnad;
  result -= is.rantenetto;

  // Subtract long-term sustainable equivalents
  result -= totalMaintenanceAnnuity;
  result -= longTermInterest;

  if (landLeaseProjected !== null) {
    result -= landLeaseProjected;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Full calculation orchestrator
// ---------------------------------------------------------------------------

export function runFullCalculation(
  input: AnalysisInput,
  kpifIndex: Map<number, number>
): CalculationResult {
  const realRanta = calculateRealInterestRate(
    input.parametrar.forvantadNominellRanta,
    input.parametrar.forvantadInflation
  );

  // Maintenance
  const underhallsposter = input.underhallsplan.poster.map((item) =>
    calculateMaintenanceItem(item, realRanta, kpifIndex)
  );
  const totalUnderhallsannuitet = underhallsposter.reduce(
    (sum, item) => sum + item.annuitet,
    0
  );

  // Net assets & interest
  const nettoTillgangar = calculateNetAssets(
    input.balansrakning,
    input.fastighet.vardeHyreslagenheter
  );
  const langfristigRantekostnad = calculateLongTermInterest(
    nettoTillgangar,
    realRanta,
    underhallsposter
  );

  // Land lease
  let tomtrattPrognos: LandLeaseProjection | null = null;
  let projectedLease: number | null = null;
  if (input.fastighet.arTomtratt && input.fastighet.taxeringsvardeMark) {
    tomtrattPrognos = calculateLandLeaseProjection(
      input.fastighet.bta,
      input.fastighet.taxeringsvardeMark
    );
    projectedLease = tomtrattPrognos.arligAvgald;
  }

  // Long-term result & per sqm
  const langfristigtResultat = calculateLongTermResult(
    input.resultatrakning,
    totalUnderhallsannuitet,
    langfristigRantekostnad,
    projectedLease
  );
  const overskottUnderskottPerKvm =
    langfristigtResultat / input.fastighet.totalBostadsyta;

  // Recommendation
  const rekommendation = calculateRecommendation(
    overskottUnderskottPerKvm,
    input.resultatrakning.medlemsavgifter,
    input.fastighet.totalBostadsyta
  );

  return {
    underhallsposter,
    totalUnderhallsannuitet,
    nettoTillgangar,
    realRanta,
    langfristigRantekostnad,
    tomtrattPrognos,
    langfristigtResultat,
    overskottUnderskottPerKvm,
    rekommendation,
  };
}
