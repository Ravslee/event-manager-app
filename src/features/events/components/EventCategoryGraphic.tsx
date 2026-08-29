import { useEffect, useRef } from "react";
import {
  Heart,
  Briefcase,
  Music,
  PartyPopper,
  Utensils,
  Sparkles,
  Presentation,
  Award,
  CalendarCheck,
  GlassWater,
  Building2,
  Camera,
} from "lucide-react";

interface EventCategoryGraphicProps {
  typeName?: string;
  typeColor?: string;
  className?: string;
}

const ICON_PATHS: Record<string, string[]> = {
  wedding: [
    "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
    "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z",
  ],
  music: [
    "M9 18V5l12-2v13M9 9l12-2M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M12 14A2 2 0 1 0 12 10A2 2 0 0 0 12 14Z",
  ],
  party: [
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    "M8 22h8M12 15v7M5 2h14l-2 9a5 5 0 0 1-5 4v0a5 5 0 0 1-5-4L5 2z",
  ],
  corporate: [
    "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M2 6h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z",
    "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M6 12h12M6 17h12M10 6h4",
  ],
  photoshoot: [
    "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",
    "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z",
  ],
  award: [
    "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.11",
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  ],
  catering: [
    "M18 2v20M18 2a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3M6 2v6a3 3 0 0 0 3 3v11M6 2a3 3 0 0 0 3 3v3",
  ],
  general: [
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z",
  ],
};

interface CategoryTheme {
  bg1: string;
  bg2: string;
  key: string;
  icon: any;
}

const CATEGORY_MAP: Record<string, CategoryTheme> = {
  wedding: { bg1: "#9f1239", bg2: "#e11d48", key: "wedding", icon: Heart },
  corporate: { bg1: "#1e3a8a", bg2: "#2563eb", key: "corporate", icon: Briefcase },
  conference: { bg1: "#4c1d95", bg2: "#7c3aed", key: "corporate", icon: Presentation },
  concert: { bg1: "#701a75", bg2: "#c026d3", key: "music", icon: Music },
  music: { bg1: "#581c87", bg2: "#9333ea", key: "music", icon: Music },
  birthday: { bg1: "#78350f", bg2: "#d97706", key: "party", icon: PartyPopper },
  party: { bg1: "#831843", bg2: "#db2777", key: "party", icon: GlassWater },
  gala: { bg1: "#713f12", bg2: "#ca8a04", key: "award", icon: Sparkles },
  catering: { bg1: "#064e3b", bg2: "#059669", key: "catering", icon: Utensils },
  award: { bg1: "#4c1d95", bg2: "#7c3aed", key: "award", icon: Award },
  exhibition: { bg1: "#164e63", bg2: "#0891b2", key: "corporate", icon: Building2 },
  photoshoot: { bg1: "#312e81", bg2: "#4f46e5", key: "photoshoot", icon: Camera },
};

export function getCategoryConfig(typeName?: string, _typeColor?: string) {
  const nameLower = (typeName || "").toLowerCase();

  for (const [key, item] of Object.entries(CATEGORY_MAP)) {
    if (nameLower.includes(key)) {
      return {
        bg1: "#0f172a",
        bg2: "#1e293b",
        key: item.key,
        IconComponent: item.icon,
      };
    }
  }

  return {
    bg1: "#0f172a",
    bg2: "#1e293b",
    key: "general",
    IconComponent: CalendarCheck,
  };
}

export default function EventCategoryGraphic({
  typeName,
  className,
}: EventCategoryGraphicProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const config = getCategoryConfig(typeName);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 360;
      const height = rect.height || 280;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear canvas so card's bg-card background shows through seamlessly
      ctx.clearRect(0, 0, width, height);

      // Detect dark mode vs light mode
      const isDarkMode = document.documentElement.classList.contains("dark");

      const strokeColor = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
      const fillColor = isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)";
      const watermarkColor = isDarkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)";

      // 1. Repeating Theme-Adaptive Icon Wallpaper Pattern Overlay
      const pathStrings = ICON_PATHS[config.key] || ICON_PATHS.general;
      const path2DList = pathStrings.map((str) => new Path2D(str));

      const stepX = 140;
      const stepY = 140;
      const iconScale = 0.55;

      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.0;

      let count = 0;
      for (let y = -20; y < height + stepY; y += stepY) {
        const offsetX = (Math.floor(y / stepY) % 2 === 0) ? 0 : stepX / 2;
        for (let x = -20; x < width + stepX; x += stepX) {
          const posX = x + offsetX;
          const posY = y;
          const path2d = path2DList[count % path2DList.length];

          ctx.save();
          ctx.translate(posX, posY);
          const angle = (count % 2 === 0 ? -12 : 12) * (Math.PI / 180);
          ctx.rotate(angle);
          ctx.scale(iconScale, iconScale);
          ctx.translate(-12, -12);

          ctx.stroke(path2d);
          if (count % 3 === 0) {
            ctx.fill(path2d);
          }

          ctx.restore();
          count++;
        }
      }

      // 2. Subtle Theme-Adaptive Watermark Initials
      ctx.globalAlpha = 1;
      const watermark = (typeName || "EVENT").toUpperCase();
      ctx.font = "900 48px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = watermarkColor;
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillText(watermark, width - 15, 10);

      ctx.restore();
    };

    render();

    const resizeObserver = new ResizeObserver(() => {
      render();
    });

    resizeObserver.observe(canvas);

    // Listen for theme mutations (light/dark mode toggle)
    const observer = new MutationObserver(() => render());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, [typeName, config]);

  return (
    <canvas
      ref={canvasRef}
      className={className || "absolute inset-0 h-full w-full pointer-events-none"}
    />
  );
}
