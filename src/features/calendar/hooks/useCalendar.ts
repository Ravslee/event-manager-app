import { useMemo, useState } from "react";

import {
  generateMonth,
  getMonthTitle,
  nextMonth,
  previousMonth,
} from "../utils/calendar.utils";

export default function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const days = useMemo(() => generateMonth(currentMonth), [currentMonth]);

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
