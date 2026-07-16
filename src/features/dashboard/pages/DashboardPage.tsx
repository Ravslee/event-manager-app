import ScheduleCard from "../components/ScheduleCard";
import StatCard from "../components/StatCard";
import {
  Calendar,
  DollarSign,
  ShoppingCart,
  Package,
  BanknoteArrowDown,
} from "lucide-react";
import FeaturedEventCard from "@/features/dashboard/components/FeaturedEventCard";
import RevenueChart from "../components/RevenueChart";
import {
  weeklyData,
  monthlyData,
} from "../components/RevenueChart/RevenueChart.constants";

export default function DashboardPage() {
  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today's Events"
            value={5}
            icon={Calendar}
            change={5}
            progress={50}
          />
          <StatCard
            title="Upcoming Events"
            value={12}
            icon={Calendar}
            change={10}
            progress={70}
          />
          <StatCard
            title="Pending Revenue"
            value="5,000"
            icon={BanknoteArrowDown}
            change={-2}
            progress={60}
          />
          <StatCard
            title="Total Revenue"
            value="2,000"
            icon={DollarSign}
            change={8}
            progress={85}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          {/* Left */}
          <ScheduleCard
            title="Today's Schedule"
            subtitle=""
            items={[
              {
                id: "1",
                time: "09:00 AM",
                title: "Client Briefing: Aurora Soft",
                subtitle: "Virtual Meeting • Room 4",
                status: "IN_PROGRESS",
                participants: ["R", "A"],
              },
              {
                id: "2",
                time: "11:30 AM",
                title: "Venue Inspection: Glass House",
                subtitle: "On-site • Downtown District",
                status: "UPCOMING",
              },
              {
                id: "3",
                time: "01:30 PM",
                title: "Venue Inspection: Glass House",
                subtitle: "On-site • Downtown District",
                status: "UPCOMING",
              },
              {
                id: "4",
                time: "02:00 PM",
                title: "Vendor Selection Panel",
                subtitle: "Conference Hall B",
                status: "DRAFT",
              },
            ]}
          />

          {/* Right */}
          <FeaturedEventCard
            badge="Flagship Event"
            title="Big Wedding"
            description="The premier gathering for industry innovators. Final logistics in progress for 500+ attendees."
            date="Oct 12, 2026"
            image="/images/tech-connect.jpg"
            onDetails={() => console.log("Details")}
          />
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
