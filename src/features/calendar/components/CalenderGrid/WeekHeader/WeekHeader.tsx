import { WEEK_DAYS } from "../../../constants/weekDays";

export default function WeekHeader() {
  return (
    <div className="grid grid-cols-7 border-b border-border bg-muted/30">
      {WEEK_DAYS.map((day) => (
        <div
          key={day}
          className="py-1.5 sm:py-2.5 text-center text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-muted-foreground"
        >
          <span className="inline sm:hidden">{day.slice(0, 1)}</span>
          <span className="hidden sm:inline">{day}</span>
        </div>
      ))}
    </div>
  );
}
