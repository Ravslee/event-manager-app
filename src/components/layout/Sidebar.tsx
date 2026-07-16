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
        "flex flex-col border-r bg-background transition-all duration-500",
        collapsed ? "w-20" : "w-72",
      )}
    >
      <Logo />
      <nav className="space-y-2 px-4">
        {navigation.map((item: any) => (
          <SidebarItem
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
