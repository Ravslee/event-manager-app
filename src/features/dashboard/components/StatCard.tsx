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
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="space-y-4 p-5">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>

          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-semibold",
                isPositive ? "text-green-600" : "text-red-500",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight">{value}</h2>
        </div>

        <Progress value={progress} className="h-2 rounded-full" />
      </CardContent>
    </Card>
  );
}
