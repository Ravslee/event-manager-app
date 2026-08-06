import { useEffect, useState } from "react";
import ScheduleCard from "../components/ScheduleCard";
import StatCard from "../components/StatCard";
import { Calendar, DollarSign, BanknoteArrowDown } from "lucide-react";
import FeaturedEventCard from "@/features/dashboard/components/FeaturedEventCard";
import RevenueChart from "../components/RevenueChart";
import { weeklyData, monthlyData } from "../components/RevenueChart/RevenueChart.constants";
import { getDashboardData } from "../api/dashboard.api";
import type { DashboardData } from "../types/dashboard.types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardData();
        setData(response);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return <div className="flex h-[80vh] items-center justify-center text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today's Events"
            value={data.summary.todayEventsCount}
            icon={Calendar}
            change={0}
            progress={data.summary.todayEventsCount > 0 ? 100 : 0}
          />
          <StatCard
            title="Upcoming Events"
            value={data.summary.upcomingEventsCount}
            icon={Calendar}
            change={0}
            progress={data.summary.upcomingEventsCount > 0 ? 100 : 0}
          />
          <StatCard
            title="Pending Revenue"
            value={formatCurrency(data.summary.pendingRevenue)}
            icon={BanknoteArrowDown}
            change={0}
            progress={data.summary.totalRevenue > 0 ? (data.summary.pendingRevenue / data.summary.totalRevenue) * 100 : 0}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(data.summary.totalRevenue)}
            icon={DollarSign}
            change={0}
            progress={100}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          {/* Left */}
          <ScheduleCard
            title="Today's Schedule"
            subtitle=""
            items={data.todaySchedule.map((event) => ({
              id: event._id,
              time: event.startTime,
              title: event.title,
              subtitle: `${event.client?.name || "Client"} • ${event.venue?.name || "TBD"}`,
              status: event.status === "Completed" ? "COMPLETED" : event.status === "Pending" ? "UPCOMING" : "IN_PROGRESS",
            }))}
          />

          {/* Right */}
          {data.upcomingEvents.length > 0 ? (
            <FeaturedEventCard
              badge="Upcoming Event"
              title={data.upcomingEvents[0].title}
              description={`Event for ${data.upcomingEvents[0].client?.name || "Client"} at ${data.upcomingEvents[0].venue?.name || "TBD"}.`}
              date={format(new Date(data.upcomingEvents[0].eventDate), "MMM dd, yyyy")}
              image="/images/tech-connect.jpg"
              onDetails={() => { }}
            />
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="font-bold text-foreground">No Upcoming Events</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
                You don't have any upcoming events scheduled.
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          {/* Bottom */}
          <RevenueChart
            chartData={{ weekly: weeklyData, monthly: monthlyData }}
          />
        </div>
      </div>
    </>
  );
}
