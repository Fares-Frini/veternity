import type { ConsultationStatus } from "./data";

export const STATUS_META: Record<ConsultationStatus, { bg: string; text: string }> = {
  "Terminée": { bg: "bg-secondary", text: "text-secondary-foreground" },
  "En cours": { bg: "bg-status-info-bg", text: "text-status-info" },
  "Annulée": { bg: "bg-status-danger-bg", text: "text-status-danger" },
};

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | null)[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push(null);
    result.push(page);
  });
  return result;
}
