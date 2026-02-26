import { z } from "zod";

// ---------------------------------------------------------------------------
// Step 1: Fastighetsuppgifter (Property Info)
// ---------------------------------------------------------------------------

export const propertyInfoSchema = z.object({
  kommun: z.string().min(1, "Kommun krävs"),
  fastighetsbeteckning: z.string().min(1, "Fastighetsbeteckning krävs"),
  bta: z.coerce.number().positive("BTA måste vara positivt"),
  totalBostadsyta: z.coerce.number().positive("Bostadsyta måste vara positiv"),
  vardeHyreslagenheter: z.coerce.number().min(0).default(0),

  // Tomträtt (land lease)
  arTomtratt: z.boolean().default(false),
  tomtrattBundenTill: z.coerce.number().optional(),
  tomtrattArligAvgald: z.coerce.number().optional(),

  // Tax assessment for land lease calculation
  taxeringsvardeMark: z.coerce.number().optional(),
});

export type PropertyInfo = z.infer<typeof propertyInfoSchema>;

// ---------------------------------------------------------------------------
// Step 2: Balansräkning (Balance Sheet)
// ---------------------------------------------------------------------------

export const balanceSheetSchema = z.object({
  kassaBank: z.coerce.number().min(0, "Kan inte vara negativt"),
  forutbetaldaKostnader: z.coerce.number().min(0).default(0),
  ovrigaOmsattningstillgangar: z.coerce.number().min(0).default(0),

  banklan: z.coerce.number().min(0).default(0),
  upplupenKostnader: z.coerce.number().min(0).default(0),
  ovrigaKortfristigaSkulder: z.coerce.number().min(0).default(0),
});

export type BalanceSheet = z.infer<typeof balanceSheetSchema>;

// ---------------------------------------------------------------------------
// Step 3: Resultaträkning (Income Statement)
// ---------------------------------------------------------------------------

export const incomeStatementSchema = z.object({
  arsresultat: z.coerce.number(),
  medlemsavgifter: z.coerce.number().positive("Avgifterna måste vara positiva"),
  avskrivningar: z.coerce.number().min(0).default(0),
  planeradeUnderhallsutgifter: z.coerce.number().min(0).default(0),
  tomtrattskostnad: z.coerce.number().min(0).default(0),
  rantenetto: z.coerce.number(),
});

export type IncomeStatement = z.infer<typeof incomeStatementSchema>;

// ---------------------------------------------------------------------------
// Step 4: Underhållsplan (Maintenance Plan)
// ---------------------------------------------------------------------------

export const maintenanceItemSchema = z.object({
  beskrivning: z.string().min(1, "Beskrivning krävs"),
  senastUtfort: z.coerce
    .number()
    .int()
    .min(1900, "Ange ett giltigt årtal")
    .max(new Date().getFullYear(), "Kan inte vara i framtiden"),
  kostnadDa: z.coerce.number().positive("Kostnad måste vara positiv"),
  intervall: z.coerce.number().int().positive("Intervall krävs"),
});

export type MaintenanceItem = z.infer<typeof maintenanceItemSchema>;

export const maintenancePlanSchema = z.object({
  poster: z
    .array(maintenanceItemSchema)
    .min(1, "Minst en underhållspost krävs"),
});

export type MaintenancePlan = z.infer<typeof maintenancePlanSchema>;

// ---------------------------------------------------------------------------
// Adjustable Parameters
// ---------------------------------------------------------------------------

export const parametersSchema = z.object({
  forvantadInflation: z.coerce.number().min(0).max(20).default(2.0),
  forvantadNominellRanta: z.coerce.number().min(0).max(20).default(5.0),
});

export type Parameters = z.infer<typeof parametersSchema>;

// ---------------------------------------------------------------------------
// Combined Analysis Input
// ---------------------------------------------------------------------------

export const analysisInputSchema = z.object({
  fastighet: propertyInfoSchema,
  balansrakning: balanceSheetSchema,
  resultatrakning: incomeStatementSchema,
  underhallsplan: maintenancePlanSchema,
  parametrar: parametersSchema,
});

export type AnalysisInput = z.infer<typeof analysisInputSchema>;

// ---------------------------------------------------------------------------
// Calculation Output Types
// ---------------------------------------------------------------------------

export interface MaintenanceItemResult {
  beskrivning: string;
  kostnadIdagspengar: number;
  annuitet: number;
  arTillNasta: number;
  rantekomponent: number;
}

export interface LandLeaseProjection {
  marknadsvarde: number;
  avgaldsunderlag: number;
  arligAvgald: number;
}

export interface Recommendation {
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  rubrik: string;
  beskrivning: string;
  procentjustering: number;
  plan: string[];
}

export interface CalculationResult {
  underhallsposter: MaintenanceItemResult[];
  totalUnderhallsannuitet: number;

  nettoTillgangar: number;
  realRanta: number;
  langfristigRantekostnad: number;

  tomtrattPrognos: LandLeaseProjection | null;

  langfristigtResultat: number;
  overskottUnderskottPerKvm: number;

  rekommendation: Recommendation;
}
