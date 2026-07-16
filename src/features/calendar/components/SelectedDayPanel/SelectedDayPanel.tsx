import { CalendarDays } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
interface Props {
  selectedDate: Date;
}

export default function SelectedDayPanel({ selectedDate }: Props) {
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

        <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
          <CalendarDays className="h-8 w-8 text-primary" />

          <div>
            <p className="font-semibold">No Events</p>

            <p className="text-sm text-muted-foreground">
              Select a date to view schedule
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
