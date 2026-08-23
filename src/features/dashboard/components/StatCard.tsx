import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change?: number;
  progress?: number;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  progress = 0,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <Card className="rounded-2xl sm:rounded-3xl border border-border/80 shadow-xs hover:shadow-sm transition-all duration-200">
      <CardContent className="space-y-2.5 sm:space-y-4 p-3 sm:p-5">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 shrink-0">
            <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
          </div>

          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-sm font-semibold shrink-0",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
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

          <h2 className="mt-0.5 sm:mt-1 text-base sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground truncate">
            {value}
          </h2>
        </div>

        <Progress value={progress} className="h-1.5 sm:h-2 rounded-full" />
      </CardContent>
    </Card>
  );
}
