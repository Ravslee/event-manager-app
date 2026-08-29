import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

interface SidebarItemProps {
  icon: LucideIcon;
  title: string;
  to: string;
  collapsed: boolean;
}

export function SidebarItem({
  icon: Icon,
  title,
  to,
  collapsed,
}: SidebarItemProps) {
  const { collapseSidebarOnSelect } = useSidebar();

  return (
    <NavLink
      to={to}
      title={collapsed ? title : undefined}
      onClick={collapseSidebarOnSelect}
      className={({ isActive }) =>
        `flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive
            ? "bg-primary text-primary-foreground font-bold shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
        } ${collapsed ? "justify-center px-1.5 sm:px-2" : "gap-3 px-3"}`
      }
    >
      <Icon className="h-4.5 w-4.5 shrink-0 transition-transform duration-300" />

      {!collapsed && (
        <span className="truncate transition-opacity duration-300 animate-in fade-in-50">
          {title}
        </span>
      )}
    </NavLink>
  );
}
