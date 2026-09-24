"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useInventoryVersion } from "../_components/inventory-store";
import { KpiStrip, KpiTile, formatAmount } from "../_components/inventory-ui";
import { daysUntil, findStockItem } from "../_components/stock-data";
import { findSupplier } from "../_components/suppliers-data";
import { PURCHASES, SALES, tradeTotal } from "../_components/trade-data";
import { PurchasesColumn, SalesColumn } from "./_components/trade-columns";
import { TradeDetailDialog, type TradeSelection } from "./_components/trade-detail-dialog";
import { TradeEditorDialog, type TradeEditorInit } from "./_components/trade-editor-dialog";

const PERIODS = [
  { value: "7", label: "7 jours" },
  { value: "30", label: "30 jours" },
  { value: "90", label: "90 jours" },
];

/** Ouvre directement une nouvelle commande depuis le stock ou un fournisseur (`?commander=`). */
function useOrderShortcut(open: (init: TradeEditorInit) => void) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const target = params.get("commander");

  useEffect(() => {
    if (!target) return;
    if (findSupplier(target)) open({ mode: "purchase", supplierId: target });
    else if (findStockItem(target)) open({ mode: "purchase", productId: target });
    else open({ mode: "purchase" });
    router.replace(pathname, { scroll: false });
  }, [target, open, router, pathname]);
}

function VentesAchats() {
  useInventoryVersion();
  const [period, setPeriod] = useState("30");
  const [salesFilter, setSalesFilter] = useState<"all" | "open">("all");
  const [purchasesFilter, setPurchasesFilter] = useState<"all" | "open">("all");
  const [selection, setSelection] = useState<TradeSelection | null>(null);
  const [editor, setEditor] = useState<TradeEditorInit | null>(null);

  useOrderShortcut(setEditor);

  const inPeriod = (date: string) => -daysUntil(date) < Number(period);
  const sales = SALES.filter((s) => inPeriod(s.date)).sort((a, b) => b.date.localeCompare(a.date));
  const purchases = PURCHASES.filter((p) => inPeriod(p.date) || p.status !== "Reçue").sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const revenue = sales.reduce((sum, s) => sum + tradeTotal(s.lines), 0);
  const toCollect = sales.filter((s) => !s.paid).reduce((sum, s) => sum + tradeTotal(s.lines), 0);
  const spend = purchases.filter((p) => inPeriod(p.date)).reduce((sum, p) => sum + tradeTotal(p.lines), 0);
  const margin = sales.reduce(
    (sum, s) => sum + s.lines.reduce((m, l) => m + (l.unitPrice - (findStockItem(l.productId)?.purchasePrice ?? 0)) * l.quantity, 0),
    0,
  );
  const pending = PURCHASES.filter((p) => p.status !== "Reçue");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Ventes et achats de produits sur la période, côte à côte. Les commandes en attente restent affichées.
        </p>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={0}
          value={period}
          onValueChange={(v) => v && setPeriod(v)}
          aria-label="Période"
        >
          {PERIODS.map((p) => (
            <ToggleGroupItem key={p.value} value={p.value} className="px-3 data-[state=on]:bg-primary/12 data-[state=on]:font-semibold">
              {p.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <KpiStrip>
        <KpiTile label="Chiffre d'affaires produits" value={formatAmount(revenue)} detail={`${sales.length} ventes · ${formatAmount(toCollect)} à encaisser`} />
        <KpiTile label="Achats" value={formatAmount(spend)} detail={`${purchases.filter((p) => inPeriod(p.date)).length} commandes passées`} />
        <KpiTile
          label="Marge brute sur ventes"
          value={formatAmount(Math.round(margin))}
          detail={revenue ? `${Math.round((margin / revenue) * 100)} % du chiffre d'affaires` : "—"}
        />
        <KpiTile
          label="Livraisons attendues"
          value={pending.length}
          detail={`${formatAmount(pending.reduce((sum, p) => sum + tradeTotal(p.lines), 0))} en commande`}
          active={purchasesFilter === "open"}
          onClick={() => setPurchasesFilter((f) => (f === "open" ? "all" : "open"))}
        />
      </KpiStrip>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <SalesColumn
          sales={sales}
          filter={salesFilter}
          onFilterChange={setSalesFilter}
          onSelect={(sale) => setSelection({ kind: "sale", sale })}
          onNew={() => setEditor({ mode: "sale" })}
        />
        <PurchasesColumn
          purchases={purchases}
          filter={purchasesFilter}
          onFilterChange={setPurchasesFilter}
          onSelect={(purchase) => setSelection({ kind: "purchase", purchase })}
          onNew={() => setEditor({ mode: "purchase" })}
        />
      </div>

      <TradeDetailDialog selection={selection} onClose={() => setSelection(null)} />
      <TradeEditorDialog
        init={editor}
        onClose={() => setEditor(null)}
        onCreated={(id) => {
          setEditor(null);
          const sale = SALES.find((s) => s.id === id);
          const purchase = PURCHASES.find((p) => p.id === id);
          if (sale) setSelection({ kind: "sale", sale });
          else if (purchase) setSelection({ kind: "purchase", purchase });
        }}
      />
    </div>
  );
}

export default function VentesAchatsPage() {
  return (
    <Suspense fallback={null}>
      <VentesAchats />
    </Suspense>
  );
}
