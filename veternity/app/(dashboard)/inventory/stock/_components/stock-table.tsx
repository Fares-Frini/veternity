import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  EXPIRY_WARNING_DAYS,
  STATUS_BADGE,
  daysUntil,
  formatQuantity,
  nearestExpiry,
  stockStatus,
  type StockItem,
} from "../../_components/stock-data";
import { SortableHead, formatAmount, formatShortDate, type SortDirection } from "../../_components/inventory-ui";

export type StockSortKey = "status" | "name" | "stock" | "expiry" | "value";

function StockLevel({ item }: { item: StockItem }) {
  const status = stockStatus(item);
  const ratio = Math.min(1, item.quantity / Math.max(1, item.alertThreshold * 3));
  const barColor =
    item.quantity === 0 ? "bg-status-danger" : item.quantity <= item.alertThreshold ? "bg-status-warning" : "bg-status-success";

  return (
    <div className="flex w-32 flex-col gap-1">
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          status === "Rupture" ? "text-status-danger" : item.quantity <= item.alertThreshold ? "text-status-warning" : "text-foreground",
        )}
      >
        {formatQuantity(item, item.quantity)}
      </span>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className={cn("h-full rounded-full", barColor)} style={{ width: `${Math.max(ratio * 100, item.quantity ? 4 : 0)}%` }} />
      </div>
      <span className="text-[11px] text-muted-foreground tabular-nums">Seuil {item.alertThreshold}</span>
    </div>
  );
}

export function ExpiryCell({ item }: { item: StockItem }) {
  const expiry = nearestExpiry(item);
  if (!expiry) return <span className="text-sm text-muted-foreground">—</span>;
  const days = daysUntil(expiry);
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-sm text-foreground tabular-nums">{formatShortDate(expiry)}</span>
      {days < 0 ? (
        <span className="text-xs font-medium text-status-danger">Périmé depuis {-days} j</span>
      ) : days <= EXPIRY_WARNING_DAYS ? (
        <span className="text-xs font-medium text-status-warning">Dans {days} j</span>
      ) : (
        <span className="text-xs text-muted-foreground">{item.lots.length > 1 ? `${item.lots.length} lots` : "1 lot"}</span>
      )}
    </div>
  );
}

export function StockTable({
  items,
  sortKey,
  sortDirection,
  onSort,
  onSelect,
}: {
  items: StockItem[];
  sortKey: StockSortKey;
  sortDirection: SortDirection;
  onSort: (key: StockSortKey) => void;
  onSelect: (item: StockItem) => void;
}) {
  const head = (key: StockSortKey, label: string, align?: "right") => (
    <SortableHead label={label} active={sortKey === key} direction={sortDirection} onClick={() => onSort(key)} align={align} />
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="pl-5">{head("name", "Produit")}</TableHead>
          <TableHead className="text-muted-foreground">Catégorie</TableHead>
          <TableHead>{head("stock", "Stock")}</TableHead>
          <TableHead>{head("expiry", "Péremption")}</TableHead>
          <TableHead className="text-right text-muted-foreground">Prix de vente</TableHead>
          <TableHead className="text-right">{head("value", "Valeur", "right")}</TableHead>
          <TableHead className="pr-5">{head("status", "Statut")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const status = stockStatus(item);
          return (
            <TableRow
              key={item.id}
              tabIndex={0}
              onClick={() => onSelect(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(item);
                }
              }}
              className="cursor-pointer border-border outline-none focus-visible:bg-muted"
            >
              <TableCell className="py-3 pl-5">
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.form} · {item.location}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{item.category}</TableCell>
              <TableCell>
                <StockLevel item={item} />
              </TableCell>
              <TableCell>
                <ExpiryCell item={item} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col leading-tight">
                  <span className="text-sm text-foreground tabular-nums">{formatAmount(item.unitPrice)}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">achat {formatAmount(item.purchasePrice)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold text-foreground tabular-nums">
                {formatAmount(item.quantity * item.purchasePrice)}
              </TableCell>
              <TableCell className="pr-5">
                <Badge variant={STATUS_BADGE[status]}>{status}</Badge>
              </TableCell>
            </TableRow>
          );
        })}
        {items.length === 0 && (
          <TableRow className="border-border hover:bg-transparent">
            <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
              Aucun produit ne correspond à ces filtres.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
