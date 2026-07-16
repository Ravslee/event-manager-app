import {
  Calendar,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Settings,
  Tags,
  Briefcase,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: Calendar,
  },
  {
    title: "Events",
    path: "/events",
    icon: CalendarDays,
  },
  {
    title: "Payments",
    path: "/payments",
    icon: CreditCard,
  },
  {
    title: "Services",
    path: "/services",
    icon: Briefcase,
  },
  {
    title: "Event Types",
    path: "/event-types",
    icon: Tags,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
