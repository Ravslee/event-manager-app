import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-x-auto lg:overflow-x-hidden transition-all duration-300">
      <Sidebar />
      <div className="flex min-w-[calc(100vw-3.5rem)] sm:min-w-[calc(100vw-4rem)] lg:min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background text-foreground">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
