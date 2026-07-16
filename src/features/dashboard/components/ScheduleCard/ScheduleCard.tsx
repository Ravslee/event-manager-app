import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";

import ScheduleItemRow from "./ScheduleItem";
import { type ScheduleCardProps } from "./types";

export default function ScheduleCard({
  title,
  subtitle,
  items,
}: ScheduleCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>

          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        <button className="flex items-center gap-2 font-medium text-violet-700">
          View Calendar
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {items.map((item) => (
        <ScheduleItemRow key={item.id} item={item} />
      ))}
    </Card>
  );
}
