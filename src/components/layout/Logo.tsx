import { useSidebar } from "@/context/SidebarContext";

export function Logo() {
  const { collapsed } = useSidebar();
  return (
    <div className="flex items-center gap-2 px-6 py-5">
      {/* <CalendarDays className="h-7 w-7 text-primary" /> */}

      <div>
        <h2 className="font-bold text-lg transition-all duration-500">
          {collapsed ? "E" : "Eventra"}
        </h2>

        {!collapsed && (
          <p className="text-xs text-muted-foreground ">Event Manager</p>
        )}
      </div>
    </div>
  );
}
