import { Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import type { OrderStatus } from "@/lib/orders-data";

const STATUS_STYLES: Record<OrderStatus, { bg: string; fg: string; icon: typeof Clock }> = {
  Processing: { bg: "#F5EBD9", fg: "#A67C2E", icon: Clock },
  Shipped: { bg: "#E5EEFE", fg: "#2563EB", icon: Truck },
  Delivered: { bg: "#E4F8EE", fg: "#059669", icon: CheckCircle2 },
  Cancelled: { bg: "#F1F0EE", fg: "#78716C", icon: XCircle },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { bg, fg, icon: Icon } = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
      style={{ backgroundColor: bg, color: fg }}
    >
      <Icon size={13} strokeWidth={2.5} />
      {status}
    </span>
  );
}
