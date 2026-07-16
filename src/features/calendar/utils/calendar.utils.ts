import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

import { type CalendarDay, type CalendarEvent } from "../types/calendar.types";

export function generateMonth(
  month: Date,
  events: CalendarEvent[],
): CalendarDay[] {
  const monthStart = startOfMonth(month);

  const monthEnd = endOfMonth(month);

  const calendarStart = startOfWeek(monthStart, {
    weekStartsOn: 0,
  });

  // Always create 42 cells
  const calendarEnd = addDays(calendarStart, 41);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, month),
    isToday: isSameDay(date, new Date()),
    events: events.filter((event) => isSameDay(event.start, date)),
  }));
}

export function nextMonth(month: Date) {
  return addMonths(month, 1);
}

export function previousMonth(month: Date) {
  return subMonths(month, 1);
}

export function getMonthTitle(month: Date) {
  return format(month, "MMMM yyyy");
}
