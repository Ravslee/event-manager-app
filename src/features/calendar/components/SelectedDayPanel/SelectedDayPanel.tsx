import { CalendarDays, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import type { CalendarEvent } from "../../types/calendar.types";
import { cn } from "@/lib/utils";

interface Props {
  selectedDate: Date;
  events?: CalendarEvent[];
}

export default function SelectedDayPanel({ selectedDate, events = [] }: Props) {
  return (
    <Card className="flex flex-col h-full rounded-2xl border border-border shadow-xs overflow-hidden min-h-[380px]">
      <CardContent className="flex flex-col flex-1 p-0">
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Selected Day
            </p>
            <h2 className="text-lg sm:text-2xl font-extrabold text-foreground tracking-tight mt-0.5">
              {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Today"}
            </h2>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
            {events.length} {events.length === 1 ? "Event" : "Events"}
          </span>
        </div>

        {/* Panel Body / Events List */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-card/40 rounded-xl border border-dashed border-border/80 h-full min-h-[220px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                <CalendarDays className="h-6 w-6" />
              </div>
              <p className="text-sm font-extrabold text-foreground">No events on this day</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                Enjoy your free day or schedule a new event for this date.
              </p>
            </div>
          ) : (
            events.map((event) => {
              const isHex = event.color?.startsWith("#");
              const statusColor =
                event.status === "confirmed" || event.status === "CONFIRMED"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : event.status === "pending" || event.status === "PENDING"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";

              return (
                <div
                  key={event.id}
                  className="group relative rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all duration-200 overflow-hidden flex flex-col gap-2"
                >
                  {/* Left Accent Color Indicator */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                    style={isHex ? { backgroundColor: event.color } : {}}
                  />

                  <div className="flex items-center justify-between gap-2 pl-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusColor}`}>
                      {event.status}
                    </span>

                    <span className="flex items-center text-xs font-semibold text-muted-foreground shrink-0">
                      <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                      {format(event.start, "h:mm a")}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-foreground pl-1 leading-snug group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
