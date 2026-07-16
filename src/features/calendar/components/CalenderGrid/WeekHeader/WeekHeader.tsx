import { WEEK_DAYS } from "../../../constants/weekDays";

export default function WeekHeader() {
  return (
    <div className="grid grid-cols-7 border-b">
      {WEEK_DAYS.map((day) => (
        <div
          key={day}
          className="py-4 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {day}
        </div>
      ))}
    </div>
  );
}
