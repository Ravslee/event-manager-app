import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";

// import { monthlyData, weeklyData } from "./RevenueChart.constants";
import type { RevenueChartProps } from "./RevenueChart.types";

export default function RevenueChart({ chartData }: RevenueChartProps) {
  const [view, setView] = useState("month");
  console.log(chartData);
  const { weekly, monthly } = chartData;

  const data = view === "week" ? weekly : monthly;

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">Revenue Overview</h3>

          <p className="text-muted-foreground">Monthly performance tracking</p>
        </div>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => {
            if (value) setView(value);
          }}
        >
          <ToggleGroupItem value="week">Week</ToggleGroupItem>

          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#7c3aed"
              fill="#ede9fe"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
