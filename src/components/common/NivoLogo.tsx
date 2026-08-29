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

        {/* Lowercase nivo Text */}
        <text
          x="50"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground font-extrabold"
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: "30px",
            fontWeight: 800,
            letterSpacing: "-0.5px"
          }}
        >
          nivo
        </text>
      </svg>

      {showSubtitle && (
        <div className="min-w-0 flex flex-col justify-center">
          <span className="font-extrabold text-sm sm:text-base text-foreground leading-none tracking-tight">
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
