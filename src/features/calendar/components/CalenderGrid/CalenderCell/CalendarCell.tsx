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
      onClick={() => onSelect(day.date)}
      className={cn(
        "group relative h-13 sm:h-20 md:h-24 border-b border-r border-border/60 bg-background p-1 sm:p-1.5 transition-all cursor-pointer hover:bg-primary/5 select-none flex flex-col justify-between",
        !day.isCurrentMonth && "bg-muted/15 opacity-60",
        selected && "ring-2 ring-primary ring-inset z-10 bg-primary/[0.03]",
      )}
    >
      <div className="flex justify-end">
        <div
          className={cn(
            "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold transition-all",
            day.isToday && "bg-primary text-primary-foreground font-black shadow-xs",
            !day.isCurrentMonth && "text-muted-foreground",
          )}
        >
          {format(day.date, "d")}
        </div>
      </div>

      {/* Events indicator on Mobile vs Desktop */}
      <div className="mt-0.5 space-y-0.5 overflow-hidden">
        {/* Mobile View: Event Dots Indicator */}
        <div className="flex sm:hidden items-center justify-center gap-1 flex-wrap px-0.5 py-0.5">
          {day.events.slice(0, 3).map((event) => {
            const isHex = event.color?.startsWith("#");
            return (
              <span
                key={event.id}
                className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                style={isHex ? { backgroundColor: event.color } : {}}
              />
            );
          })}
          {day.events.length > 3 && (
            <span className="text-[8px] font-bold text-muted-foreground">+{day.events.length - 3}</span>
          )}
        </div>

        {/* Desktop View: Full Event Badges */}
        <div className="hidden sm:block space-y-1">
          {visibleEvents.map((event) => (
            <CalendarEvent key={event.id} event={event} />
          ))}

          {remainingEvents > 0 && (
            <span className="block text-[10px] font-bold text-primary hover:underline px-1">
              +{remainingEvents} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
