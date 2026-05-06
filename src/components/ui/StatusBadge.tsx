import type { TicketStatus } from "../../api/types";
import { statusLabel } from "../../utils/format";

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`badge status-${status}`}>{statusLabel(status)}</span>;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge badge-neutral">{children}</span>;
}
