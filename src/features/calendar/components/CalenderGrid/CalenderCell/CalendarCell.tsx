import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";

import type { CalendarCellProps } from "./CalendarCell.types";
import CalendarEvent from "../../CalendarEvent";

export default function CalendarCell({
  day,
  selectedDate,
  onSelect,
}: CalendarCellProps) {
  const selected = isSameDay(day.date, selectedDate);

  const MAX_VISIBLE_EVENTS = 2;
  const visibleEvents = day.events.slice(0, MAX_VISIBLE_EVENTS);
  const remainingEvents = day.events.length - MAX_VISIBLE_EVENTS;

  return (
    <div
      onClick={() => {
        console.log(day.date);
        onSelect(day.date);
      }}
      className={cn(
        "group relative h-36 border border-l-0 border-t-0 bg-background p-3 transition-all hover:bg-primary/5",
        !day.isCurrentMonth && "bg-muted/10",
        selected && "ring-2 ring-primary",
      )}
    >
      <div className="flex justify-end">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",

            day.isToday && "bg-primary text-white",

            !day.isCurrentMonth && "text-muted-foreground",
          )}
        >
          {format(day.date, "d")}
        </div>
      </div>

      {/* Events will go here later */}
      <div className="mt-3 space-y-1">
        {visibleEvents.map((event) => (
          <CalendarEvent key={event.id} event={event} />
        ))}

        {remainingEvents > 0 && (
          <button className="text-xs font-medium text-primary hover:underline">
            +{remainingEvents} more
          </button>
        )}
      </div>
    </div>
  );
}
