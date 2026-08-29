import { ArrowRight, CalendarOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ScheduleItemRow from "./ScheduleItem";
import { type ScheduleCardProps } from "./types";

export default function ScheduleCard({
  title,
  subtitle,
  items,
  className,
}: ScheduleCardProps) {
  const navigate = useNavigate();

  return (
    <Card className={cn("overflow-hidden rounded-2xl border border-border shadow-xs flex flex-col min-h-[480px]", className)}>
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/60 bg-card shrink-0">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        <button
          onClick={() => navigate("/calendar")}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer transition-colors"
        >
          View Calendar
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-card/40 flex-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <CalendarOff className="h-6 w-6" />
          </div>
          <p className="text-sm font-extrabold text-foreground">No events scheduled for today</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
            You have no events on today's schedule. Click View Calendar to check upcoming dates.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60 flex-1 overflow-y-auto">
          {items.map((item) => (
            <ScheduleItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </Card>
  );
}

