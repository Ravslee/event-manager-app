import { Badge } from "@/components/ui/badge";

type Status =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "partial"
  | "paid";

interface Props {
  status: Status;
}

const styles: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  partial: "bg-orange-100 text-orange-800",
  paid: "bg-emerald-100 text-emerald-800",
};

export function StatusBadge({ status }: Props) {
  return <Badge className={styles[status]}>{status}</Badge>;
}
