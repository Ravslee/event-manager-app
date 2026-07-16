import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Sidebar } from "./Sidebar";

export default function MobileSidebar() {
  return (
    <Sheet>

      <SheetTrigger asChild>

        <button>
          <Menu className="h-6 w-6" />
        </button>

      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 p-0"
      >
        <Sidebar />
      </SheetContent>

    </Sheet>
  );
}