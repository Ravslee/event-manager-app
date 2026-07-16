import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CalendarHeaderProps } from "./CalendarHeader.types";


export default function CalendarHeader({
  monthTitle,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      {/* Left Section */}
      <div className="flex items-center gap-3">

        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="secondary"
          onClick={onToday}
        >
          Today
        </Button>

        <h2 className="ml-4 text-2xl font-bold">
          {monthTitle}
        </h2>

      </div>

      {/* Right Section */}
      <div className="relative w-full lg:w-80">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search events..."
          className="pl-10"
        />

      </div>

    </div>
  );
}