import type { CalendarDay } from "../../../types/calendar.types";

export interface CalendarCellProps {
  day: CalendarDay;
  selectedDate: Date;
  onSelect(date: Date): void;
}
