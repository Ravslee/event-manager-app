import { Card } from "@/components/ui/card";
import { Calendar, CalendarDays, DollarSign, Banknote } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryMetricsCardProps {
  todayEventsCount: number;
  upcomingEventsCount: number;
  pendingRevenue: number;
  totalRevenue: number;
}

export default function SummaryMetricsCard({
  todayEventsCount,
  upcomingEventsCount,
  pendingRevenue,
  totalRevenue,
}: SummaryMetricsCardProps) {
  const metrics = [
    {
      title: "Today's Events",
      value: todayEventsCount,
      icon: Calendar,
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Upcoming Events",
      value: upcomingEventsCount,
      icon: CalendarDays,
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Pending Revenue",
      value: formatCurrency(pendingRevenue),
      icon: Banknote,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x divide-border/60">
        {metrics.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3.5 lg:px-6 first:pl-0 last:pr-0"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ${item.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                  {item.title}
                </p>
                <h3 className="mt-0.5 text-base sm:text-xl lg:text-2xl font-extrabold text-foreground truncate">
                  {item.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
