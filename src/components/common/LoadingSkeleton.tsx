import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  rows?: number;
}

export function LoadingSkeleton({ rows = 6 }: Props) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
