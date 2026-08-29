import { useSidebar } from "@/context/SidebarContext";
import { Logo } from "./Logo";
import { SidebarItem } from "./SidebarItem";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300 z-30 shrink-0 select-none overflow-hidden",
        collapsed
          ? "w-0 border-r-0 lg:w-20 lg:border-r"
          : "w-64 lg:w-72 border-r",
      )}
    >
      <Logo />
      <nav className={cn("space-y-1.5 transition-all duration-300", collapsed ? "px-1.5 sm:px-2" : "px-3 sm:px-4")}>
        {navigation.map((item: any) => (
          <SidebarItem
            key={item.path}
            to={item.path}
            title={item.title}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  );
}
