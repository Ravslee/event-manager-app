import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

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
  return (
    <NavLink
      to={to}
      title={collapsed ? title : undefined}
      className={({ isActive }) =>
        `flex items-center rounded-xl py-2.5 text-sm font-medium transition-all ${
          isActive
            ? "bg-primary text-primary-foreground font-bold shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
        } ${collapsed ? "justify-center px-1.5 sm:px-2" : "gap-3 px-3"}`
      }
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />

      {!collapsed && <span className="truncate">{title}</span>}
    </NavLink>
  );
}
