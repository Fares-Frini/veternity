import type { IconSvgElement } from "@hugeicons/react";
import { BirdIcon, CarrotIcon, CatIcon, FootprintsIcon } from "@hugeicons/core-free-icons";

export const SPECIES_COLOR: Record<string, string> = {
  Chat: "bg-status-purple-bg text-status-purple",
  Chien: "bg-status-info-bg text-status-info",
  Lapin: "bg-status-warning-bg text-status-warning",
  Oiseau: "bg-secondary text-secondary-foreground",
};

export const SPECIES_ICON: Record<string, IconSvgElement> = {
  Chat: CatIcon,
  Chien: FootprintsIcon,
  Lapin: CarrotIcon,
  Oiseau: BirdIcon,
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
