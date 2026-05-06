import type { TicketStatus } from "../api/types";

export const statusOptions: Array<{ value: TicketStatus; label: string }> = [
  { value: "open", label: "Open" },
  { value: "in_review", label: "In review" },
  { value: "resolved", label: "Resolved" },
];

export function statusLabel(status: TicketStatus): string {
  return statusOptions.find((item) => item.value === status)?.label ?? status;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function excerpt(value: string, max = 140): string {
  return value.length > max ? `${value.slice(0, max).trim()}...` : value;
}
