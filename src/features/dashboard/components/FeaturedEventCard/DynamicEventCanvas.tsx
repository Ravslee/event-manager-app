import { useEffect, useRef } from "react";

interface DynamicEventCanvasProps {
  title: string;
  className?: string;
}

// Modern vibrant color palettes tailored for event banners
const PALETTES = [
  { bg1: "#4f46e5", bg2: "#7c3aed", bg3: "#db2777", accent: "rgba(255, 255, 255, 0.18)" },
  { bg1: "#0284c7", bg2: "#2563eb", bg3: "#4f46e5", accent: "rgba(56, 189, 248, 0.22)" },
  { bg1: "#059669", bg2: "#0d9488", bg3: "#2563eb", accent: "rgba(52, 211, 153, 0.22)" },
  { bg1: "#d97706", bg2: "#dc2626", bg3: "#7c3aed", accent: "rgba(251, 191, 36, 0.22)" },
  { bg1: "#7e22ce", bg2: "#c026d3", bg3: "#e11d48", accent: "rgba(244, 114, 182, 0.22)" },
];

function getPalette(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
}

export default function DynamicEventCanvas({ title, className }: DynamicEventCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 600;
      const height = rect.height || 400;
      const dpr = window.devicePixelRatio || 1;

      // Internal bitmap resolution matched exactly to display container dimensions
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.scale(dpr, dpr);

      const palette = getPalette(title || "Event");

      // 1. Multi-step color linear gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, palette.bg1);
      gradient.addColorStop(0.5, palette.bg2);
      gradient.addColorStop(1, palette.bg3);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Abstract Radial Light Flares
      const radGrad1 = ctx.createRadialGradient(width * 0.85, height * 0.2, 10, width * 0.85, height * 0.2, 200);
      radGrad1.addColorStop(0, palette.accent);
      radGrad1.addColorStop(1, "transparent");
      ctx.fillStyle = radGrad1;
      ctx.beginPath();
      ctx.arc(width * 0.85, height * 0.2, 200, 0, Math.PI * 2);
      ctx.fill();

      const radGrad2 = ctx.createRadialGradient(width * 0.15, height * 0.85, 10, width * 0.15, height * 0.85, 240);
      radGrad2.addColorStop(0, "rgba(255, 255, 255, 0.14)");
      radGrad2.addColorStop(1, "transparent");
      ctx.fillStyle = radGrad2;
      ctx.beginPath();
      ctx.arc(width * 0.15, height * 0.85, 240, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Grid Curves
      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = 2.5;
      for (let i = -100; i < width + 150; i += 45) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.bezierCurveTo(i + 120, height * 0.35, i - 60, height * 0.65, i + 100, height);
        ctx.stroke();
      }

      // 3. Watermark Title Initials
      const words = title.trim().split(" ").filter(Boolean);
      const initials = words.map((w) => w[0]).join("").toUpperCase().slice(0, 3) || "EVT";

      ctx.font = "900 110px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillText(initials, width - 25, 15);

      ctx.restore();
    };

    render();

    const resizeObserver = new ResizeObserver(() => {
      render();
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [title]);

  return (
    <canvas
      ref={canvasRef}
      className={className || "absolute inset-0 h-full w-full pointer-events-none"}
    />
  );
}
