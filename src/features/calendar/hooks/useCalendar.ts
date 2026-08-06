import { useMemo, useState, useEffect } from "react";

import {
  generateMonth,
  getMonthTitle,
  nextMonth,
  previousMonth,
} from "../utils/calendar.utils";
import { getCalendar } from "@/features/events/api/event.api";
import type { CalendarEvent } from "../types/calendar.types";

export default function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCalendar({
          view: "month",
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear(),
        });

        if (data?.events) {
          const formattedEvents = data.events.map((e: any) => {
            // Backend provides date as ISO string, parse it
            const eventDate = new Date(e.date);

            // If startTime is provided (e.g. "14:00"), adjust the date object
            if (e.startTime) {
              const [hours, minutes] = e.startTime.split(":");
              eventDate.setHours(Number(hours) || 0, Number(minutes) || 0);
            }

            const endDate = new Date(eventDate);
            if (e.endTime) {
              const [endHours, endMinutes] = e.endTime.split(":");
              endDate.setHours(Number(endHours) || 0, Number(endMinutes) || 0);
            } else {
              endDate.setHours(eventDate.getHours() + 1); // default 1 hr
            }

            return {
              id: e.id,
              title: e.title,
              start: eventDate,
              end: endDate,
              color: e.color || "blue",
              status: (e.status?.toLowerCase() || "confirmed") as any,
            };
          });
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      }
    };

    fetchEvents();
  }, [currentMonth.getMonth(), currentMonth.getFullYear()]);

  const days = useMemo(() => generateMonth(currentMonth, events), [currentMonth, events]);

  const monthTitle = useMemo(() => getMonthTitle(currentMonth), [currentMonth]);

  const goToNextMonth = () => {
    setCurrentMonth((prev) => nextMonth(prev));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => previousMonth(prev));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return {
    currentMonth,
    monthTitle,
    days,
    selectedDate,
    setSelectedDate,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
  };
}
