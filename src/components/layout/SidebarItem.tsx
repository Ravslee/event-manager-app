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
      className={({ isActive }) =>
        `flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        } ${collapsed ? "justify-center" : "gap-3"}`
      }
    >
      <Icon size={18} />

      {!collapsed && title}
    </NavLink>
  );
}
