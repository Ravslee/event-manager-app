import { Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick?: () => void;
  label: string;
  icon?: LucideIcon;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function FloatingActionButton({
  onClick,
  label,
  icon: Icon = Plus,
  className,
  type = "button",
  disabled = false,
}: FloatingActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "fixed bottom-8 right-8 z-50 flex items-center h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl hover:bg-primary/95 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group cursor-pointer border border-white/20 hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 px-4 select-none disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
    >
      <div className="flex items-center justify-center shrink-0">
        <Icon className="h-6 w-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-12" />
      </div>

      <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <span className="pl-3 text-sm font-bold tracking-wide">
            {label}
          </span>
        </div>
      </div>
    </button>
  );
}
