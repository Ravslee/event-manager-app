import CalendarGrid from "../components/CalenderGrid/CalendarGrid";
import CalendarHeader from "../components/CalenderHeader";
import SelectedDayPanel from "../components/SelectedDayPanel";
import useCalendar from "../hooks/useCalendar";

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

        <SelectedDayPanel selectedDate={selectedDate} />
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
