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
        "flex flex-col border-r bg-sidebar transition-all duration-300 z-30 shrink-0 select-none",
        collapsed
          ? "w-14 sm:w-16 md:w-20"
          : "w-64 md:w-72",
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
