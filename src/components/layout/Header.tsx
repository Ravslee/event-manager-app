import { Bell, Moon, PanelLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useSidebar } from "@/context/SidebarContext";

export function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* <div className="lg:hidden">
        <MobileSidebar />
      </div> */}
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <PanelLeft />
      </Button>

      <div className="relative w-96">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4
          -translate-y-1/2 text-muted-foreground"
        />
        <Input type="text" className="pl-10" placeholder="Search..." />
      </div>

      <div className="flex items-center gap-4">
        <Bell className="h-5 w-5 cursor-pointer" />

        <Moon className="h-5 w-5 cursor-pointer" />

        <img
          src="https://i.pravatar.cc/40"
          className="h-10 w-10 rounded-full"
          alt="User"
        />
      </div>
    </header>
  );
}
