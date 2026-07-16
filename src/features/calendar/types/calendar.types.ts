export type EventStatus = "confirmed" | "pending" | "completed" | "cancelled";

export interface CalendarEvent {
  id: string;
  title: string;

  start: Date;
  end: Date;

  color: string;

  status: EventStatus;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}
