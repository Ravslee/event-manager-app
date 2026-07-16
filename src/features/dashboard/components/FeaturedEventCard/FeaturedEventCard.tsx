import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <Card className="relative h-[520px] overflow-hidden rounded-3xl border-0 p-0 shadow-md">
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-16 text-white">
        {/* Badge */}
        <Badge className="w-fit rounded-full bg-violet-700 px-4 py-4 text-sx uppercase tracking-wider text-white bg-violet-700">
          {badge}
        </Badge>

        {/* Bottom Section */}
        <div>
          <h2 className="text-5xl font-bold leading-tight">{title}</h2>

          <p className="mt-5 text-lg leading-8 text-slate-200">{description}</p>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5" />

              <span className="font-medium">{date}</span>
            </div>

            <Button
              variant="secondary"
              className="rounded-b-md bg-white/20 backdrop-blur-md hover:bg-white/30"
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
