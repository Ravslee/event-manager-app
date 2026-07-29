import { Bell, Moon, PanelLeft, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useSidebar } from "@/context/SidebarContext";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || "User";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
        <Bell className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" />

        <Moon className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" />

        <div className="flex items-center gap-3 border-l pl-4">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-bold text-foreground leading-none">{userName}</span>
            <span className="text-[10px] text-muted-foreground">Administrator</span>
          </div>
          <img
            src="https://i.pravatar.cc/40"
            className="h-9 w-9 rounded-full border border-border"
            alt="User"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg"
            title="Log Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
