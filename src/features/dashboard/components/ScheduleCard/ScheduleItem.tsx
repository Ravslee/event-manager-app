import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { type ScheduleItem } from "./types";

const statusStyles = {
  IN_PROGRESS: "bg-violet-100 text-violet-700",
  UPCOMING: "bg-slate-100 text-slate-600",
  DRAFT: "bg-orange-100 text-orange-700",
};

const statusText = {
  IN_PROGRESS: "In Progress",
  UPCOMING: "Upcoming",
  DRAFT: "Draft",
};

interface Props {
  item: ScheduleItem;
}

export default function ScheduleItemRow({ item }: Props) {
  return (
    <div className="flex items-center justify-between border-t px-6 py-5">

      <div className="w-24 shrink-0">
        <p className="text-xs font-semibold tracking-[0.25em] text-muted-foreground">
          {item.time}
        </p>
      </div>

      <div className="flex-1">

        <h4 className="text-lg font-semibold">
          {item.title}
        </h4>

        <p className="text-muted-foreground">
          {item.subtitle}
        </p>

      </div>

      <div className="flex items-center gap-4">

        {item.participants && (
          <div className="flex -space-x-3">
            {item.participants.map((name) => (
              <Avatar key={name} className="border bg-slate-200">
                <AvatarFallback>
                  {name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}

        <Badge
          className={statusStyles[item.status]}
          variant="secondary"
        >
          {statusText[item.status]}
        </Badge>

      </div>

    </div>
  );
}