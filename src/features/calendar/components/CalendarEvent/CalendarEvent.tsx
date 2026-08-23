import { cn } from "@/lib/utils";
import type { CalendarEventProps } from "./CalendarEvent.types";

export type EventColor = "purple" | "green" | "blue" | "orange" | "red";

const EVENT_COLORS: any = {
  purple: "bg-violet-500",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
};

export default function CalendarEvent({ event }: CalendarEventProps) {
  const isHex = event.color?.startsWith("#");

  return (
    <div
      className={cn(
        "mb-0.5 flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white truncate shadow-2xs",
        !isHex && (EVENT_COLORS[event.color] || "bg-blue-500"),
        "cursor-pointer transition hover:opacity-90",
      )}
      style={isHex ? { backgroundColor: event.color } : {}}
    >
      <div className="h-1.5 w-1.5 rounded-full bg-white/70 shrink-0" />
      <span className="truncate">{event.title}</span>
    </div>
  );
}
