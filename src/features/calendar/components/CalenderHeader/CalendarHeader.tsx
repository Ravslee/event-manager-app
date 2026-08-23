import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CalendarHeaderProps } from "./CalendarHeader.types";

export default function CalendarHeader({
  monthTitle,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-card border border-border p-3 sm:p-4 rounded-2xl shadow-xs">
      {/* Navigation & Month Title */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl shrink-0"
          title="Previous Month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl shrink-0"
          title="Next Month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onToday}
          className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm font-bold rounded-xl shrink-0"
        >
          Today
        </Button>

        <h2 className="ml-2 sm:ml-3 text-base sm:text-xl font-extrabold text-foreground tracking-tight truncate">
          {monthTitle}
        </h2>
      </div>
    </div>
  );
}