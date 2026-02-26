"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import React from "react";
import type {
  PropertyInfo,
  BalanceSheet,
  IncomeStatement,
  MaintenanceItem,
  Parameters,
  CalculationResult,
} from "@/lib/models";
import { DEFAULT_PARAMETERS, EXAMPLE_MAINTENANCE_ITEMS } from "@/lib/constants";
import { saveDraft, loadDraft, clearDraft } from "@/lib/storage";

interface AnalysisState {
  fastighet: Partial<PropertyInfo>;
  balansrakning: Partial<BalanceSheet>;
  resultatrakning: Partial<IncomeStatement>;
  underhallsposter: MaintenanceItem[];
  parametrar: Parameters;
  currentStep: number;
  kpifIndex: Map<number, number> | null;
  result: CalculationResult | null;
}

interface AnalysisActions {
  setFastighet: (data: PropertyInfo) => void;
  setBalansrakning: (data: BalanceSheet) => void;
  setResultatrakning: (data: IncomeStatement) => void;
  setUnderhallsposter: (items: MaintenanceItem[]) => void;
  setParametrar: (params: Parameters) => void;
  setKpifIndex: (index: Map<number, number>) => void;
  setResult: (result: CalculationResult) => void;
  reset: () => void;
}

type Store = AnalysisState & AnalysisActions;

const initialState: AnalysisState = {
  fastighet: {},
  balansrakning: {},
  resultatrakning: {},
  underhallsposter: EXAMPLE_MAINTENANCE_ITEMS,
  parametrar: DEFAULT_PARAMETERS,
  currentStep: 0,
  kpifIndex: null,
  result: null,
};

function persist(next: AnalysisState): void {
  saveDraft({
    fastighet: next.fastighet,
    balansrakning: next.balansrakning,
    resultatrakning: next.resultatrakning,
    underhallsposter: next.underhallsposter,
    parametrar: next.parametrar,
    currentStep: next.currentStep,
  });
}

const AnalysisContext = createContext<Store | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalysisState>(initialState);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setState((s) => ({
        ...s,
        fastighet: draft.fastighet,
        balansrakning: draft.balansrakning,
        resultatrakning: draft.resultatrakning,
        underhallsposter:
          draft.underhallsposter.length > 0
            ? draft.underhallsposter
            : EXAMPLE_MAINTENANCE_ITEMS,
        parametrar: draft.parametrar,
        currentStep: draft.currentStep,
      }));
    }
  }, []);

  const setFastighet = useCallback(
    (data: PropertyInfo) =>
      setState((s) => {
        const next = {
          ...s,
          fastighet: data,
          currentStep: Math.max(s.currentStep, 1),
        };
        persist(next);
        return next;
      }),
    []
  );
  const setBalansrakning = useCallback(
    (data: BalanceSheet) =>
      setState((s) => {
        const next = {
          ...s,
          balansrakning: data,
          currentStep: Math.max(s.currentStep, 2),
        };
        persist(next);
        return next;
      }),
    []
  );
  const setResultatrakning = useCallback(
    (data: IncomeStatement) =>
      setState((s) => {
        const next = {
          ...s,
          resultatrakning: data,
          currentStep: Math.max(s.currentStep, 3),
        };
        persist(next);
        return next;
      }),
    []
  );
  const setUnderhallsposter = useCallback(
    (items: MaintenanceItem[]) =>
      setState((s) => {
        const next = {
          ...s,
          underhallsposter: items,
          currentStep: Math.max(s.currentStep, 4),
        };
        persist(next);
        return next;
      }),
    []
  );
  const setParametrar = useCallback(
    (params: Parameters) =>
      setState((s) => {
        const next = { ...s, parametrar: params };
        persist(next);
        return next;
      }),
    []
  );
  const setKpifIndex = useCallback(
    (index: Map<number, number>) =>
      setState((s) => ({ ...s, kpifIndex: index })),
    []
  );
  const setResult = useCallback(
    (result: CalculationResult) =>
      setState((s) => ({ ...s, result })),
    []
  );
  const reset = useCallback(() => {
    clearDraft();
    setState(initialState);
  }, []);

  const store: Store = {
    ...state,
    setFastighet,
    setBalansrakning,
    setResultatrakning,
    setUnderhallsposter,
    setParametrar,
    setKpifIndex,
    setResult,
    reset,
  };

  return React.createElement(
    AnalysisContext.Provider,
    { value: store },
    children
  );
}

export function useAnalysisStore(): Store {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysisStore must be used within AnalysisProvider");
  }
  return ctx;
}
