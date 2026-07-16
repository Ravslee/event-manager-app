import useCalendar from "../../hooks/useCalendar";
import type { CalendarDay } from "../../types/calendar.types";
import CalendarCell from "./CalenderCell";
import WeekHeader from "./WeekHeader";

interface Props {
  days: CalendarDay[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export default function CalendarGrid({ days, selectedDate, onSelect }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <WeekHeader />

      <div className="grid grid-cols-7">
        {days.map((day) => (
          <CalendarCell
            key={day.date.toISOString()}
            day={day}
            selectedDate={selectedDate}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
