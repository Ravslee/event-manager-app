export interface DashboardSummary {
  todayEventsCount: number;
  upcomingEventsCount: number;
  completedEventsCount: number;
  pendingPaymentsCount: number;
  totalRevenue: number;
  pendingRevenue: number;
  monthlyRevenue: Array<{ _id: string | null; totalRevenue: number }>;
}

export interface DashboardEvent {
  _id: string;
  title: string;
  client: { name: string; phone: string; email: string };
  eventDate: string;
  startTime: string;
  endTime?: string;
  venue: { name: string; address: string };
  status: string;
  isDeleted: boolean;
}

export interface DashboardPayment {
  _id: string;
  userId: string;
  eventId: any; // Can be populated Event
  totalAmount: number;
  paidAmount: number;
  status: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  todaySchedule: DashboardEvent[];
  upcomingEvents: DashboardEvent[];
  pendingPayments: DashboardPayment[];
  eventTypeBreakdown: Array<{ _id: string; count: number }>;
}
