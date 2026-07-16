import { cn } from "@/lib/utils";
import type { CalendarEventProps } from "./CalendarEvent.types";

type EventColor = "purple" | "green" | "blue" | "orange" | "red";

const EVENT_COLORS: any = {
  purple: "bg-violet-500",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
};

export default function CalendarEvent({ event }: CalendarEventProps) {
  return (
    <div
      className={cn(
        "mb-1 flex items-center gap-2 rounded-sm px-2 py-1 text-xs font-medium text-white",
        EVENT_COLORS[event.color],
        "cursor-pointer transition hover:opacity-90",
      )}
    >
      <div className="h-2 w-2 rounded-full bg-white" />

      <span className="truncate">{event.title}</span>
    </div>
  );
}
