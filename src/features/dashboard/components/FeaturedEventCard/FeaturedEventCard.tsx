import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import DynamicEventCanvas from "./DynamicEventCanvas";
import { type FeaturedEventCardProps } from "./FeaturedEventCard.types";

export default function FeaturedEventCard({
  badge,
  title,
  description,
  date,
  image,
  onDetails,
}: FeaturedEventCardProps) {
  return (
    <Card className="relative h-[300px] overflow-hidden rounded-2xl border-0 p-0 shadow-md">
      {/* Dynamic Canvas Background or Custom Image */}
      {image ? (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <DynamicEventCanvas title={title} className="absolute inset-0 h-full w-full object-cover" />
      )}

      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-950/20" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-6 text-white">
        {/* Badge */}
        <Badge className="w-fit rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs uppercase tracking-wider text-white border border-white/20">
          {badge}
        </Badge>

        {/* Bottom Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm">{title}</h2>

          <p className="mt-2 text-sm text-slate-200 line-clamp-2">{description}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200">
              <CalendarDays className="h-5 w-5" />

              <span className="font-medium text-sm sm:text-base">{date}</span>
            </div>

            <Button
              variant="secondary"
              className="rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 cursor-pointer"
              onClick={onDetails}
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

