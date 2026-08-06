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
        "mb-1 flex items-center gap-2 rounded-sm px-2 py-1 text-xs font-medium text-white",
        !isHex && (EVENT_COLORS[event.color] || "bg-blue-500"),
        "cursor-pointer transition hover:opacity-90",
      )}
      style={isHex ? { backgroundColor: event.color } : {}}
    >
      <div className="h-2 w-2 rounded-full bg-white/50" />

      <span className="truncate">{event.title}</span>
    </div>
  );
}
