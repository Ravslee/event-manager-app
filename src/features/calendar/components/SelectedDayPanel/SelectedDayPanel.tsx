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
    <Card className="h-full rounded-3xl">
      <CardContent className="space-y-6 p-6">
        <div>
          <p className="text-sm text-muted-foreground uppercase">
            Selected Day
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            {selectedDate && format(selectedDate, "MMMM d")}
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
            <CalendarDays className="h-8 w-8 text-primary" />

            <div>
              <p className="font-semibold">No Events</p>
              <p className="text-sm text-muted-foreground">
                Enjoy your free day!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 120px)" }}>
            {events.map((event) => {
              const isHex = event.color?.startsWith("#");
              return (
                <div key={event.id} className="rounded-xl border p-4 shadow-sm transition hover:shadow-md">
                  <div className="mb-2 flex items-center justify-between">
                    <span 
                      className={cn("rounded-sm px-2 py-0.5 text-xs font-medium text-white", !isHex && "bg-blue-500")}
                      style={isHex ? { backgroundColor: event.color } : {}}
                    >
                      {event.status.toUpperCase()}
                    </span>
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {format(event.start, "h:mm a")}
                    </span>
                  </div>
                  <h4 className="font-semibold">{event.title}</h4>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
