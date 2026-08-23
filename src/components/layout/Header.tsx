import { useState, useEffect, useRef } from "react";
import { Moon, Sun, PanelLeft, Search, LogOut, Calendar, CreditCard, Layers, X, Settings, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useSidebar } from "@/context/SidebarContext";
import api from "@/api/axios";

import { getMyProfile } from "@/features/settings/api/settings.api";

interface SearchResultItem {
  id: string;
  title: string;
  category: "event" | "service" | "payment";
  path: string;
  subtitle?: string;
}

export function Header() {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  // Dark mode state
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

  // User & Profile State
  const [user, setUser] = useState<any>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  useEffect(() => {
    // Fetch latest profile from backend on mount
    getMyProfile()
      .then((profileData) => {
        if (profileData) {
          setUser((prev: any) => {
            const updated = { ...(prev || {}), ...profileData };
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch(() => {});

    const syncUser = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    };

    window.addEventListener("profileUpdated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("profileUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const ownerName = user?.ownerName || user?.name || user?.fullName || (user?.email ? user.email.split("@")[0] : "Owner");
  const businessName = user?.businessName || user?.role || "Administrator";

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Search State & Live Navigation
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // User Profile Dropdown state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search Input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const q = searchQuery.toLowerCase();

    // Fetch matching events and services for search dropdown
    Promise.all([
      api.get("/events").catch(() => null),
      api.get("/services").catch(() => null),
    ]).then(([eventsRes, servicesRes]) => {
      const results: SearchResultItem[] = [];

      if (eventsRes?.data?.success && eventsRes.data.data?.events) {
        eventsRes.data.data.events.forEach((ev: any) => {
          if (ev.title?.toLowerCase().includes(q) || ev.client?.name?.toLowerCase().includes(q)) {
            results.push({
              id: ev._id,
              title: ev.title,
              category: "event",
              path: "/events",
              subtitle: ev.client?.name ? `Client: ${ev.client.name}` : undefined,
            });
          }
        });
      }

      if (servicesRes?.data?.success && servicesRes.data.data?.services) {
        servicesRes.data.data.services.forEach((s: any) => {
          if (s.name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q)) {
            results.push({
              id: s._id,
              title: s.name,
              category: "service",
              path: `/services/${s._id}`,
              subtitle: s.category ? `Category: ${s.category}` : undefined,
            });
          }
        });
      }

      setSearchResults(results.slice(0, 6));
      setIsSearching(false);
      setShowSearchDropdown(true);
    });
  }, [searchQuery]);

  return (
    <header className="flex h-14 sm:h-16 items-center justify-between border-b bg-background px-2.5 sm:px-4 md:px-6 z-40 relative gap-2 sm:gap-4">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-accent shrink-0"
          title="Toggle Sidebar"
        >
          <PanelLeft className="h-4.5 w-4.5 text-muted-foreground" />
        </Button>

        {/* Business Branding Badge */}
        {businessName && (
          <div className="hidden xs:flex items-center gap-1.5 sm:gap-2 border-r border-border/60 pr-2 sm:pr-3.5 mr-0.5 shrink-0">
            <div className="flex h-6.5 w-6.5 sm:h-7 sm:w-7 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight max-w-[100px] xs:max-w-[130px] sm:max-w-[180px] truncate">
              {businessName}
            </span>
          </div>
        )}

        {/* Global Live Search Bar */}
        <div ref={searchRef} className="relative w-full max-w-[160px] xs:max-w-[200px] sm:w-48 md:w-64 lg:w-80">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            className="pl-8 sm:pl-9 pr-7 sm:pr-8 h-8 sm:h-9 text-xs rounded-xl bg-muted/30 focus:bg-background transition-colors"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) setShowSearchDropdown(true);
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearchDropdown(false);
              }}
              className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Search Dropdown Popup */}
          {showSearchDropdown && (
            <div className="absolute left-0 mt-2 w-[calc(100vw-2.5rem)] max-w-sm sm:w-full rounded-2xl border border-border bg-card shadow-xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>Quick Search Results</span>
                {isSearching && <span className="animate-pulse text-xs">Searching...</span>}
              </div>

              {searchResults.length === 0 ? (
                <div className="px-3 py-4 text-xs text-center text-muted-foreground">
                  {isSearching ? "Loading results..." : `No matches found for "${searchQuery}"`}
                </div>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setShowSearchDropdown(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      {item.category === "event" ? (
                        <Calendar className="h-3.5 w-3.5" />
                      ) : item.category === "service" ? (
                        <Layers className="h-3.5 w-3.5" />
                      ) : (
                        <CreditCard className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-[10px] text-muted-foreground truncate">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
        {/* Dark / Light Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-amber-500" /> : <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
        </Button>



        {/* User Profile Dropdown */}
        <div ref={userMenuRef} className="relative border-l border-border/60 pl-1.5 sm:pl-3">
          <div
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-accent/50 transition-colors"
          >
            <img
              src={user?.avatar || user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-primary/20 shrink-0"
              alt={ownerName}
            />
            <div className="flex flex-col text-left hidden md:flex pr-1 min-w-0">
              <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[130px]">{ownerName}</span>
              <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[130px]">{user?.role || "Owner"}</span>
            </div>
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-[220px] sm:w-52 rounded-2xl border border-border bg-card shadow-xl p-1.5 z-50 space-y-1 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-border/60">
                <p className="text-xs font-bold text-foreground truncate">{ownerName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{businessName} • {user?.email || "admin@eventmgr.com"}</p>
              </div>

              <button
                onClick={() => {
                  navigate("/settings");
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent rounded-xl transition-colors text-left"
              >
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                Account Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-left"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
