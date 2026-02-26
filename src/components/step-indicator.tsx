"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StepIndicator() {
  const pathname = usePathname();

  const currentIndex = STEPS.findIndex((s) => pathname.startsWith(s.path));

  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2 py-6">
      {STEPS.map((step, i) => {
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;
        const isResult = i === STEPS.length - 1;

        return (
          <div key={step.path} className="flex items-center gap-1 sm:gap-2">
            {i > 0 && (
              <div
                className={cn(
                  "h-px w-4 sm:w-8",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <Link
              href={step.path}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                isActive &&
                  "bg-primary text-primary-foreground",
                isCompleted &&
                  "bg-primary/10 text-primary hover:bg-primary/20",
                !isActive &&
                  !isCompleted &&
                  "text-muted-foreground hover:text-foreground",
                isResult && isActive && "bg-green-600 text-white"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  isActive && "bg-primary-foreground text-primary",
                  isCompleted && "bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? "✓" : step.short}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
