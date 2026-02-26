"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadDraft, clearDraft } from "@/lib/storage";
import { formatTimeAgo } from "@/lib/formatters";
import { STEPS } from "@/lib/constants";

export function ResumeBanner() {
  const [draft, setDraft] = useState<{
    currentStep: number;
    savedAt: string;
  } | null>(null);

  useEffect(() => {
    const saved = loadDraft();
    if (saved && saved.currentStep > 0) {
      setDraft({ currentStep: saved.currentStep, savedAt: saved.savedAt });
    }
  }, []);

  if (!draft) return null;

  // Navigate to the next uncompleted step (or results if all done)
  const resumeIndex = Math.min(draft.currentStep, STEPS.length - 1);
  const resumePath = STEPS[resumeIndex].path;
  const savedDate = new Date(draft.savedAt);
  const timeAgo = formatTimeAgo(savedDate);

  return (
    <div className="w-full max-w-xl mx-auto rounded-lg border-2 border-primary/20 bg-primary/5 p-6 space-y-4">
      <div className="text-center">
        <p className="font-semibold">
          {"Du har en sparad analys"}
        </p>
        <p className="text-sm text-muted-foreground">
          {`Steg ${draft.currentStep} av 4 klart \u2014 sparad ${timeAgo}`}
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <Link
          href={resumePath}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          {"Forts\u00e4tt analysen"}
        </Link>
        <button
          onClick={() => {
            clearDraft();
            setDraft(null);
          }}
          className="inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-medium hover:bg-accent transition-colors"
        >
          {"B\u00f6rja om"}
        </button>
      </div>
    </div>
  );
}
