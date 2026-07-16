import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
      {icon}

      <h3 className="mt-4 text-xl font-semibold">{title}</h3>

      <p className="mt-2 max-w-md text-muted-foreground">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
