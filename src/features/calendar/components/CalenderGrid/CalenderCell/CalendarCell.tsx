import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";

import type { CalendarCellProps } from "./CalendarCell.types";

export default function CalendarCell({
  day,
  selectedDate,
  onSelect,
}: CalendarCellProps) {
  const selected = isSameDay(day.date, selectedDate);
  return (
    <div
      onClick={() => {
        console.log(day.date);
        onSelect(day.date);
      }}
      className={cn(
        "group relative h-36 border border-l-0 border-t-0 bg-background p-3 transition-all hover:bg-muted/40",
        !day.isCurrentMonth && "bg-muted/10",
        selected && "bg-primary/5",
      )}
    >
      <div className="flex justify-end">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",

            day.isToday && "bg-primary text-primary-foreground",

            !day.isCurrentMonth && "text-muted-foreground",
          )}
        >
          {format(day.date, "d")}
        </div>
      </div>

      {/* Events will go here later */}
    </div>
  );
}
