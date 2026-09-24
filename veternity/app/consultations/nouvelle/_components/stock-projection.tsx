import { formatQuantity, type StockItem } from "@/app/(dashboard)/inventory/_components/stock-data";
import { cn } from "@/lib/utils";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

/** « Stock 12 → 11 doses », signalé quand le produit passe sous son seuil d'alerte. */
export function StockProjection({ item, before, after }: { item: StockItem; before: number; after: number }) {
  const low = after <= item.alertThreshold;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs tabular-nums",
        low ? "font-medium text-status-warning" : "text-muted-foreground",
      )}
    >
      {low && <HugeiconsIcon icon={Alert02Icon} className="h-3.5 w-3.5" strokeWidth={2.2} />}
      Stock {before} → {formatQuantity(item, after)}
      {low && <span>· stock bas</span>}
    </span>
  );
}
