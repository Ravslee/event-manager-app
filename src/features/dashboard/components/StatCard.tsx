import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change?: number;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <Card className="rounded-2xl border border-border/80 shadow-xs hover:shadow-sm transition-all duration-200">
      <CardContent className="space-y-2 p-3 sm:p-4">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 shrink-0">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>

          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold shrink-0",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        {/* Title and Value */}
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {title}
          </p>

          <h2 className="mt-0.5 text-base sm:text-xl lg:text-2xl font-extrabold tracking-tight text-foreground truncate">
            {value}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
