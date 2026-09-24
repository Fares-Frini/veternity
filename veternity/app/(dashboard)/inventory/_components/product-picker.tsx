"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowDown01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, type ReactNode } from "react";
import { STOCK, findStockItem, formatQuantity, type StockItem } from "./stock-data";

/**
 * Sélecteur de produit avec recherche. `prioritize` fait remonter une partie du catalogue
 * (ex : les produits du fournisseur choisi) sous un premier intitulé.
 */
export function ProductPicker({
  value,
  onChange,
  placeholder = "Choisir un produit",
  prioritize,
  priorityLabel,
  footer,
  invalid,
  className,
}: {
  value?: string;
  onChange: (productId: string) => void;
  placeholder?: string;
  prioritize?: (item: StockItem) => boolean;
  priorityLabel?: string;
  footer?: (close: () => void) => ReactNode;
  invalid?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = findStockItem(value);

  const q = query.trim().toLowerCase();
  const matches = STOCK.filter((s) => !q || `${s.name} ${s.form} ${s.category}`.toLowerCase().includes(q));
  const groups = prioritize
    ? [
        { label: priorityLabel ?? "Suggestions", items: matches.filter(prioritize) },
        { label: "Autres produits", items: matches.filter((s) => !prioritize(s)) },
      ]
    : [{ label: "", items: matches }];

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          data-invalid={invalid || undefined}
          className={cn(
            "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-input bg-card px-2.5 text-left text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-invalid:border-status-warning",
            className,
          )}
        >
          <span className={cn("truncate", selected ? "text-foreground" : "text-muted-foreground")}>
            {selected ? selected.name : placeholder}
          </span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-80 p-0">
        <div className="relative border-b border-border">
          <HugeiconsIcon
            icon={Search01Icon}
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            aria-label="Rechercher un produit"
            className="h-10 w-full bg-transparent pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex max-h-72 flex-col overflow-y-auto p-1">
          {matches.length === 0 && <p className="px-3 py-5 text-center text-sm text-muted-foreground">Aucun produit</p>}
          {groups.map((g) =>
            g.items.length === 0 ? null : (
              <div key={g.label || "all"} className="flex flex-col gap-0.5 pb-1">
                {g.label && (
                  <span className="px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {g.label}
                  </span>
                )}
                {g.items.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onChange(s.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left outline-none hover:bg-muted focus-visible:bg-muted",
                      s.id === value && "bg-muted",
                    )}
                  >
                    <span className="flex min-w-0 flex-col leading-tight">
                      <span className="truncate text-sm font-medium text-foreground">{s.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{s.form}</span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-xs tabular-nums",
                        s.quantity === 0 ? "text-status-danger" : s.quantity <= s.alertThreshold ? "text-status-warning" : "text-muted-foreground",
                      )}
                    >
                      {s.quantity === 0 ? "Rupture" : formatQuantity(s, s.quantity)}
                    </span>
                  </button>
                ))}
              </div>
            ),
          )}
        </div>
        {footer && <div className="border-t border-border p-1">{footer(() => setOpen(false))}</div>}
      </PopoverContent>
    </Popover>
  );
}
