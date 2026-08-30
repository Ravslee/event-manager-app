import { LoginForm } from "../components/LoginForm";
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      
      {/* Top Header / Back to Landing Page Link */}
      <header className="w-full max-w-md flex items-center justify-between py-2 z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-md group-hover:scale-105 transition-transform">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">NIVO</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-8 w-8 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Link 
            to="/" 
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Minimal Login Card Container */}
      <main className="w-full max-w-md my-auto py-6 z-10">
        <LoginForm />
      </main>

      {/* Footer Copyright */}
      <footer className="text-center text-xs text-muted-foreground font-medium py-2 z-10 space-y-1">
        <p>© 2026 NIVO. All rights reserved.</p>
        <p className="text-[11px] text-muted-foreground/80">
          Developed by{" "}
          <a
            href="https://lightapps.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:underline"
          >
            LightApps.co
          </a>
        </p>
      </footer>

    </div>
  );
}
