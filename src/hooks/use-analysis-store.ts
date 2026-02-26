"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
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

interface AnalysisState {
  fastighet: Partial<PropertyInfo>;
  balansrakning: Partial<BalanceSheet>;
  resultatrakning: Partial<IncomeStatement>;
  underhallsposter: MaintenanceItem[];
  parametrar: Parameters;
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
  kpifIndex: null,
  result: null,
};

const AnalysisContext = createContext<Store | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalysisState>(initialState);

  const setFastighet = useCallback(
    (data: PropertyInfo) =>
      setState((s) => ({ ...s, fastighet: data })),
    []
  );
  const setBalansrakning = useCallback(
    (data: BalanceSheet) =>
      setState((s) => ({ ...s, balansrakning: data })),
    []
  );
  const setResultatrakning = useCallback(
    (data: IncomeStatement) =>
      setState((s) => ({ ...s, resultatrakning: data })),
    []
  );
  const setUnderhallsposter = useCallback(
    (items: MaintenanceItem[]) =>
      setState((s) => ({ ...s, underhallsposter: items })),
    []
  );
  const setParametrar = useCallback(
    (params: Parameters) =>
      setState((s) => ({ ...s, parametrar: params })),
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
  const reset = useCallback(() => setState(initialState), []);

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
