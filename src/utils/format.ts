import type { TicketStatus } from "../api/types";

export const statusOptions: Array<{ value: TicketStatus; label: string }> = [
  { value: "open", label: "Открыта" },
  { value: "in_review", label: "На рассмотрении" },
  { value: "resolved", label: "Решена" },
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

export function stripAiEnhancedPrefix(value: string): string {
  return value.replace(/^\s*\[AI-enhanced\]\s*/i, "").trim();
}

const trailingShortWords = new Set(["в", "во", "на", "к", "ко", "по", "после", "для", "из", "с", "со", "при", "через"]);

export function formatTicketGroupTitle(value: string): string {
  const words = stripAiEnhancedPrefix(value).trim().split(/\s+/).filter(Boolean).slice(0, 5);
  while (words.length > 1 && trailingShortWords.has(words[words.length - 1].toLowerCase())) {
    words.pop();
  }
  return words.join(" ") || "Новая проблема";
}
