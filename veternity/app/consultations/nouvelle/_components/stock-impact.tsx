"use client";

import { findStockItem, formatQuantity } from "@/app/(dashboard)/inventory/_components/stock-data";
import { cn } from "@/lib/utils";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { availableStock, stockUsage, useConsultationDraft } from "./draft-context";

/** Produits que la consultation consomme, avec le stock restant après usage. */
export function StockImpact({ emptyText }: { emptyText: string }) {
  const { draft } = useConsultationDraft();
  const moves = Object.entries(stockUsage(draft)).filter(([, qty]) => qty > 0);

  if (moves.length === 0) return <p className="text-sm text-muted-foreground">{emptyText}</p>;

  return (
    <ul className="flex flex-col gap-3">
      {moves.map(([id, qty]) => {
        const item = findStockItem(id);
        if (!item) return null;
        const remaining = availableStock(id, draft) - qty;
        const low = remaining <= item.alertThreshold;
        return (
          <li key={id} className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-medium text-foreground">{item.name}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs tabular-nums",
                  low ? "font-medium text-status-warning" : "text-muted-foreground",
                )}
              >
                {low && <HugeiconsIcon icon={Alert02Icon} className="h-3 w-3" strokeWidth={2.4} />}
                Reste {formatQuantity(item, remaining)}
                {low && " · stock bas"}
              </span>
            </div>
            <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">−{formatQuantity(item, qty)}</span>
          </li>
        );
      })}
    </ul>
  );
}
