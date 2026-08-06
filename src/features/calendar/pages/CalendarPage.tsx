import CalendarGrid from "../components/CalenderGrid/CalendarGrid";
import CalendarHeader from "../components/CalenderHeader";
import SelectedDayPanel from "../components/SelectedDayPanel";
import useCalendar from "../hooks/useCalendar";
import { isSameDay } from "date-fns";

export default function CalendarPage() {
  const {
    monthTitle,
    days,
    selectedDate,
    setSelectedDate,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
  } = useCalendar();

  const selectedDayEvents = days.find((day) => isSameDay(day.date, selectedDate))?.events || [];

  return (
    <div className="space-y-6">
      <CalendarHeader
        monthTitle={monthTitle}
        onPrevious={goToPreviousMonth}
        onNext={goToNextMonth}
        onToday={goToToday}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <CalendarGrid
          days={days}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        <SelectedDayPanel selectedDate={selectedDate} events={selectedDayEvents} />
      </div>
    </div>
  );
}
// ----------------------------------------------------------
// | Header                                           User |
// ----------------------------------------------------------
// |                                                  |     |
// |                                                  |     |
// |                                                  |     |
// |            Calendar Grid                         |Day  |
// |                                                  |Info |
// |                                                  |     |
// |                                                  |     |
// ----------------------------------------------------------
