import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

export function Logo() {
  const { collapsed } = useSidebar();

  return (
    <div className={cn("flex items-center transition-all duration-300 py-4", collapsed ? "justify-center px-1 sm:px-2" : "gap-2.5 px-4 sm:px-6")}>
      <div className={cn("flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-black transition-all shrink-0 shadow-xs", collapsed ? "h-8 w-8 text-sm" : "h-9 w-9 text-base")}>
        N
      </div>

      {!collapsed && (
        <div className="min-w-0">
          <h2 className="font-bold text-base text-foreground leading-none tracking-tight truncate">
            NIVO
          </h2>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5 truncate">Freelancer Hub</p>
        </div>
      )}
    </div>
  );
}
