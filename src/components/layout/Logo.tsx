import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { NivoLogo } from "@/components/common/NivoLogo";

export function Logo() {
  const { collapsed } = useSidebar();

  return (
    <div className={cn("flex items-center transition-all duration-300 py-3", collapsed ? "justify-center px-1" : "gap-2 px-4")}>
      <NivoLogo size={collapsed ? "sm" : "md"} showSubtitle={!collapsed} />
    </div>
  );
}
