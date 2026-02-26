"use client";

import { AnalysisProvider } from "@/hooks/use-analysis-store";
import { StepIndicator } from "@/components/step-indicator";

export default function AnalysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalysisProvider>
      <div className="mx-auto max-w-3xl px-4">
        <StepIndicator />
        <main className="pb-12">{children}</main>
      </div>
    </AnalysisProvider>
  );
}
