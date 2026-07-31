import type { IconSvgElement } from "@hugeicons/react";
import { CheckmarkCircle02Icon, Clock01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import type { AppointmentStatus } from "./data";

export const STATUS_META: Record<AppointmentStatus, { bg: string; text: string; bar: string; icon: IconSvgElement }> = {
  "Confirmé": { bg: "bg-status-info-bg", text: "text-status-info", bar: "bg-status-info", icon: CheckmarkCircle02Icon },
  "En attente": { bg: "bg-status-warning-bg", text: "text-status-warning", bar: "bg-status-warning", icon: Clock01Icon },
  "Terminé": { bg: "bg-secondary", text: "text-secondary-foreground", bar: "bg-primary", icon: CheckmarkCircle02Icon },
  "Annulé": { bg: "bg-status-danger-bg", text: "text-status-danger", bar: "bg-status-danger", icon: Cancel01Icon },
};

export function todayKey() {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Monday-start week range (inclusive) containing `date`. */
export function weekRange(date: Date) {
  const day = (date.getDay() + 6) % 7; // 0 = Monday
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  return { start, end };
}

export function formatDayHeader(date: string) {
  const label = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
