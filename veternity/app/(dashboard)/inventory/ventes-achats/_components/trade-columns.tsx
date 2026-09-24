"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { formatAmount, formatShortDate } from "../../_components/inventory-ui";
import { findStockItem } from "../../_components/stock-data";
import { findSupplier } from "../../_components/suppliers-data";
import { tradeTotal, type Purchase, type PurchaseStatus, type Sale, type TradeLine } from "../../_components/trade-data";

export const PURCHASE_BADGE: Record<PurchaseStatus, "info" | "warning" | "success"> = {
  Commandée: "info",
  Partielle: "warning",
  Reçue: "success",
};

function summarize(lines: TradeLine[]) {
  return lines.map((l) => `${findStockItem(l.productId)?.name ?? l.productId} ×${l.quantity}`).join(" · ");
}

function DateBlock({ date }: { date: string }) {
  const d = new Date(date);
  return (
    <div className="flex w-11 shrink-0 flex-col items-center rounded-md bg-muted py-1.5 leading-none">
      <span className="text-base font-extrabold text-foreground tabular-nums">{d.getDate()}</span>
      <span className="mt-1 text-[10px] font-semibold text-muted-foreground uppercase">
        {d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")}
      </span>
    </div>
  );
}

function Row({
  date,
  title,
  counterpart,
  summary,
  amount,
  status,
  onClick,
}: {
  date: string;
  title: string;
  counterpart: string;
  summary: string;
  amount: number;
  status: ReactNode;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:bg-muted"
      >
        <DateBlock date={date} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-sm font-semibold text-foreground">
              {counterpart}
              <span className="ml-1.5 font-mono text-xs font-normal text-muted-foreground">{title}</span>
            </span>
            <span className="shrink-0 text-sm font-bold text-foreground tabular-nums">{formatAmount(amount)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-xs text-muted-foreground">{summary}</span>
            <span className="shrink-0">{status}</span>
          </div>
        </div>
      </button>
    </li>
  );
}

function Column({
  title,
  total,
  count,
  filter,
  onFilterChange,
  filterLabel,
  actionLabel,
  onAction,
  empty,
  children,
}: {
  title: string;
  total: number;
  count: number;
  filter: "all" | "open";
  onFilterChange: (f: "all" | "open") => void;
  filterLabel: string;
  actionLabel: string;
  onAction: () => void;
  empty: string;
  children: ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex flex-col gap-3 border-b border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col leading-tight">
            <h2 className="text-sm font-bold text-foreground">{title}</h2>
            <span className="text-xs text-muted-foreground tabular-nums">
              {count} opération{count > 1 ? "s" : ""} · {formatAmount(total)}
            </span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onAction}>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2.4} />
            {actionLabel}
          </Button>
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={0}
          value={filter}
          onValueChange={(v) => v && onFilterChange(v as "all" | "open")}
          className="self-start"
        >
          <ToggleGroupItem value="all" className="px-3 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
            Toutes
          </ToggleGroupItem>
          <ToggleGroupItem value="open" className="px-3 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
            {filterLabel}
          </ToggleGroupItem>
        </ToggleGroup>
      </header>
      {count === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="divide-y divide-border">{children}</ul>
      )}
    </section>
  );
}

export function SalesColumn({
  sales,
  filter,
  onFilterChange,
  onSelect,
  onNew,
}: {
  sales: Sale[];
  filter: "all" | "open";
  onFilterChange: (f: "all" | "open") => void;
  onSelect: (sale: Sale) => void;
  onNew: () => void;
}) {
  const shown = filter === "open" ? sales.filter((s) => !s.paid) : sales;
  return (
    <Column
      title="Ventes"
      total={shown.reduce((sum, s) => sum + tradeTotal(s.lines), 0)}
      count={shown.length}
      filter={filter}
      onFilterChange={onFilterChange}
      filterLabel="À encaisser"
      actionLabel="Nouvelle vente"
      onAction={onNew}
      empty="Aucune vente sur cette période."
    >
      {shown.map((s) => (
        <Row
          key={s.id}
          date={s.date}
          title={s.id}
          counterpart={s.client}
          summary={summarize(s.lines)}
          amount={tradeTotal(s.lines)}
          onClick={() => onSelect(s)}
          status={
            s.paid ? (
              <span className="text-xs text-muted-foreground">
                {s.channel === "Consultation" ? `Consultation ${s.reference ?? ""}` : s.paymentMethod}
              </span>
            ) : (
              <Badge variant="warning">À encaisser</Badge>
            )
          }
        />
      ))}
    </Column>
  );
}

export function PurchasesColumn({
  purchases,
  filter,
  onFilterChange,
  onSelect,
  onNew,
}: {
  purchases: Purchase[];
  filter: "all" | "open";
  onFilterChange: (f: "all" | "open") => void;
  onSelect: (purchase: Purchase) => void;
  onNew: () => void;
}) {
  const shown = filter === "open" ? purchases.filter((p) => p.status !== "Reçue") : purchases;
  return (
    <Column
      title="Achats"
      total={shown.reduce((sum, p) => sum + tradeTotal(p.lines), 0)}
      count={shown.length}
      filter={filter}
      onFilterChange={onFilterChange}
      filterLabel="En attente de livraison"
      actionLabel="Nouvelle commande"
      onAction={onNew}
      empty="Aucun achat sur cette période."
    >
      {shown.map((p) => (
        <Row
          key={p.id}
          date={p.date}
          title={p.id}
          counterpart={findSupplier(p.supplierId)?.name ?? "Fournisseur"}
          summary={summarize(p.lines)}
          amount={tradeTotal(p.lines)}
          onClick={() => onSelect(p)}
          status={
            p.status === "Reçue" ? (
              <span className={cn("text-xs", p.paid ? "text-muted-foreground" : "font-medium text-foreground")}>
                Reçue{p.paid ? "" : " · à régler"}
              </span>
            ) : (
              <Badge variant={PURCHASE_BADGE[p.status]}>
                {p.status}
                {p.expectedDate && ` · ${formatShortDate(p.expectedDate).slice(0, 5)}`}
              </Badge>
            )
          }
        />
      ))}
    </Column>
  );
}
