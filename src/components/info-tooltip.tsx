"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HELP_TEXTS } from "@/lib/constants";

interface InfoTooltipProps {
  fieldName: string;
}

export function InfoTooltip({ fieldName }: InfoTooltipProps) {
  const text = HELP_TEXTS[fieldName];
  if (!text) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="ml-1 inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground">
          ?
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
