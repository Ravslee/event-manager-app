import { cn } from "@/lib/utils";

interface NivoLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
}

export function NivoLogo({ className, size = "md", showSubtitle = false }: NivoLogoProps) {
  // Dimensions map for different sizes
  const heightClass = {
    sm: "h-7",
    md: "h-10",
    lg: "h-14",
    xl: "h-20",
  }[size];

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none shrink-0", className)}>
      <svg
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(heightClass, "w-auto transition-transform duration-300 hover:scale-105")}
      >
        {/* Top Orange Bracket */}
        <path
          d="M 12 36 V 20 C 12 13 17 8 24 8 H 76 C 83 8 88 13 88 20 V 36"
          stroke="#ea580c"
          strokeWidth="7.5"
          strokeLinecap="round"
        />

        {/* Bottom Orange Bracket */}
        <path
          d="M 12 74 V 90 C 12 97 17 102 24 102 H 76 C 83 102 88 97 88 90 V 74"
          stroke="#ea580c"
          strokeWidth="7.5"
          strokeLinecap="round"
        />

        {/* Lisa BC Vector Letterforms for 'nivo' */}
        <g className="text-foreground" style={{ color: "currentColor" }}>
          {/* 'n' */}
          <path
            d="M 20 68 V 46 M 20 54 C 20 48 24 44 30 44 C 35.5 44 38 48 38 54 V 68"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* 'i' */}
          <line
            x1="45"
            y1="50"
            x2="45"
            y2="68"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <circle cx="45" cy="42" r="2.8" fill="currentColor" />

          {/* 'v' */}
          <path
            d="M 52 46.5 L 60 68 L 68 46.5"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* 'o' */}
          <circle
            cx="80"
            cy="57"
            r="10.5"
            stroke="currentColor"
            strokeWidth="4.5"
            fill="none"
          />
        </g>
      </svg>

      {showSubtitle && (
        <div className="min-w-0 flex flex-col justify-center">
          <span
            className="font-extrabold text-sm sm:text-base text-foreground leading-none tracking-tight lowercase"
            style={{ fontFamily: "'Lisa BC', 'Lisa', 'Outfit', system-ui, sans-serif" }}
          >
            nivo
          </span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium mt-0.5 truncate">
            Freelancer Hub
          </span>
        </div>
      )}
    </div>
  );
}

export default NivoLogo;
