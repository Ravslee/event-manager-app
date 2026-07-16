export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  status: "IN_PROGRESS" | "UPCOMING" | "DRAFT";
  participants?: string[];
}

export interface ScheduleCardProps {
  title: string;
  subtitle: string;
  items: ScheduleItem[];
}
