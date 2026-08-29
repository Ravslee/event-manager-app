import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextType {
  collapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  collapseSidebarOnSelect: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const collapseSidebar = () => setCollapsed(true);
  
  const collapseSidebarOnSelect = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setCollapsed(true);
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleSidebar,
        collapseSidebar,
        collapseSidebarOnSelect,
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context)
    throw new Error("useSidebar must be used inside SidebarProvider");

  return context;
}
