import type { CalendarEvent } from "../types/calendar.types";

export const calendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Stakeholder Sync",
    start: new Date(2026, 6, 15, 9, 0),
    end: new Date(2026, 6, 15, 10, 0),
    color: "purple",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Vendor Review",
    start: new Date(2026, 6, 15, 11, 0),
    end: new Date(2026, 6, 15, 12, 0),
    color: "green",
    status: "confirmed",
  },
  {
    id: "3",
    title: "Project Launch",
    start: new Date(2026, 6, 18, 14, 0),
    end: new Date(2026, 6, 16, 15, 0),
    color: "blue",
    status: "pending",
  },
];