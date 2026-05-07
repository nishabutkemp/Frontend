import type { TicketStatus } from "../../api/types";
import { statusLabel } from "../../utils/format";

export function StatusBadge({ status, className = "" }: { status: TicketStatus; className?: string }) {
  return <span className={`badge status-${status} ${className}`}>{statusLabel(status)}</span>;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge badge-neutral">{children}</span>;
}
