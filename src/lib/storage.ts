import type {
  PropertyInfo,
  BalanceSheet,
  IncomeStatement,
  MaintenanceItem,
  Parameters,
} from "./models";

const STORAGE_KEY = "sanna-avgiften-draft";
const SCHEMA_VERSION = 1;

export interface PersistedState {
  version: number;
  fastighet: Partial<PropertyInfo>;
  balansrakning: Partial<BalanceSheet>;
  resultatrakning: Partial<IncomeStatement>;
  underhallsposter: MaintenanceItem[];
  parametrar: Parameters;
  currentStep: number;
  savedAt: string;
}

export function saveDraft(
  state: Omit<PersistedState, "version" | "savedAt">
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedState = {
      ...state,
      version: SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function loadDraft(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed.version !== SCHEMA_VERSION) {
      clearDraft();
      return null;
    }
    return parsed;
  } catch {
    clearDraft();
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasDraft(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}
