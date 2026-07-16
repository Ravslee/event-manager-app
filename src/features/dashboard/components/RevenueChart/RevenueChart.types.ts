export interface ChartItem {
  name: string;
  value: number;
}

export interface RevenueChartProps {
  chartData: {
    weekly: ChartItem[];
    monthly: ChartItem[];
  };
}
