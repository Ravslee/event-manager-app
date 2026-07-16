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
      <CardContent className="space-y-8 p-8">
        {/* Top Row */}
        <div className="flex items-start justify-between">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-10 w-10 text-primary" />
          </div>

          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xl font-semibold",
                isPositive ? "text-green-600" : "text-red-500",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <p className="text-2xl font-medium text-muted-foreground">{title}</p>

          <h2 className="mt-2 text-6xl font-bold tracking-tight">{value}</h2>
        </div>

        <Progress value={progress} className="h-2 rounded-full" />
      </CardContent>
    </Card>
  );
}
