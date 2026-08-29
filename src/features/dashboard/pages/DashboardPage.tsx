import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleCard from "../components/ScheduleCard";
import SummaryMetricsCard from "../components/SummaryMetricsCard";
import { Calendar } from "lucide-react";
import FeaturedEventCard from "@/features/dashboard/components/FeaturedEventCard";
import RevenueChart from "../components/RevenueChart";
import { weeklyData, monthlyData } from "../components/RevenueChart/RevenueChart.constants";
import { getDashboardData } from "../api/dashboard.api";
import type { DashboardData } from "../types/dashboard.types";
import { format } from "date-fns";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardData();
        setData(res);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
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
        <SummaryMetricsCard
          todayEventsCount={data.summary.todayEventsCount}
          upcomingEventsCount={data.summary.upcomingEventsCount}
          pendingRevenue={data.summary.pendingRevenue}
          totalRevenue={data.summary.totalRevenue}
        />

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr] items-stretch">
          {/* Left Column: Today's Schedule with increased height */}
          <div className="h-full flex flex-col">
            <ScheduleCard
              title="Today's Schedule"
              subtitle="Overview of your events for today"
              className="h-full min-h-[580px]"
              items={data.todaySchedule.map((event) => ({
                id: event._id,
                time: event.startTime,
                title: event.title,
                subtitle: `${event.client?.name || "Client"} • ${event.venue?.name || "TBD"}`,
                status: event.status === "Completed" ? "COMPLETED" : event.status === "Pending" ? "UPCOMING" : "IN_PROGRESS",
              }))}
            />
          </div>

          {/* Right Column: Upcoming Event card on top + Revenue Graph below */}
          <div className="flex flex-col gap-6">
            {data.upcomingEvents.length > 0 ? (
              <FeaturedEventCard
                badge="Upcoming Event"
                title={data.upcomingEvents[0].title}
                description={`Event for ${data.upcomingEvents[0].client?.name || "Client"} at ${data.upcomingEvents[0].venue?.name || "TBD"}.`}
                date={format(new Date(data.upcomingEvents[0].eventDate), "MMM dd, yyyy")}
                onDetails={() => navigate("/events")}
              />
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col items-center justify-center text-center min-h-[220px]">
                <Calendar className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <h3 className="font-bold text-foreground">No Upcoming Events</h3>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-[250px]">
                  You don't have any upcoming events scheduled.
                </p>
              </div>
            )}

            {/* Revenue Chart below Upcoming Events */}
            <RevenueChart
              chartData={{ weekly: weeklyData, monthly: monthlyData }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

