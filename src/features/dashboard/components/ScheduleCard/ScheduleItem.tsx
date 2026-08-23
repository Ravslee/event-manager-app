import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { type ScheduleItem } from "./types";

const statusStyles: Record<string, string> = {
  IN_PROGRESS: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  UPCOMING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  DRAFT: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

const statusText: Record<string, string> = {
  IN_PROGRESS: "In Progress",
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
  DRAFT: "Draft",
};

interface Props {
  item: ScheduleItem;
}

export default function ScheduleItemRow({ item }: Props) {
  return (
    <div className="flex items-center justify-between p-4 sm:p-5 gap-3 hover:bg-accent/30 transition-colors">
      <div className="w-20 sm:w-24 shrink-0">
        <p className="text-[11px] sm:text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {item.time}
        </p>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm sm:text-base font-bold text-foreground truncate">
          {item.title}
        </h4>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {item.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {item.participants && (
          <div className="hidden sm:flex -space-x-3">
            {item.participants.map((name) => (
              <Avatar key={name} className="h-7 w-7 border border-background bg-slate-200">
                <AvatarFallback className="text-[10px]">
                  {name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}

        <Badge
          className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyles[item.status] || "bg-muted text-muted-foreground"}`}
          variant="outline"
        >
          {statusText[item.status] || item.status}
        </Badge>
      </div>
    </div>
  );
}